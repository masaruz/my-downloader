import * as Multiprogress from 'multi-progress'
import { copyFileSync } from 'fs-extra'

import { IDownloader, IOptions } from './interfaces'
import { clean, validateURL, getDestinationFromURL } from '@libs/utils'
import { ERROR } from '@libs/constants'

const multi = new Multiprogress(process.stderr)

class Downloader {
  private _module: IDownloader[]

  register(module: IDownloader[]) {
    this._module = module
  }

  private _checkIfSomeOfSourcesInvalid(options: IOptions[]) {
    // merge all protocols these core support right now
    const allSupportedProtocols = this._module.reduce((p, c) =>
      p.concat(c.supportedProtocols()), [] as string[])
    try {
      options.forEach(opt => {
        validateURL(allSupportedProtocols, opt.url)
      })
    } catch (e) {
      throw e
    }
  }

  async start(options: IOptions[]) {
    this._checkIfSomeOfSourcesInvalid(options)
    // start pick module to resolve each url
    const promises = this._module.reduce((p, c) => {
      return p.concat(options.map(opt =>
        // create each promise for each downloading 
        new Promise((resolve, reject) => {
          // create a instance
          const mod = c.factoryCreate()
          try {
            validateURL(mod.supportedProtocols(), opt.url)
            mod.name = opt.url
            let b: ProgressBar
            mod.on('start', () => {
              b = multi.newBar(`${mod.name} [:bar] :percent :etas`, {
                complete: '=',
                incomplete: ' ',
                total: mod.size(),
              })
            })
            mod.on('progress', progress => {
              if (b) {
                b.tick(progress)
              }
            })
            mod.download(opt)
              // when download finish
              .then(() => {
                copyFileSync(mod.dest, getDestinationFromURL(opt.url, opt.dir))
                mod.dest = opt.dir
                mod.completed = true
                if (b) {
                  // for ensure 100% completed
                  b.tick(b.total)
                }
                resolve()
                // if any error
              }).catch(e => { throw e })
          } catch (e) {
            if (e.message === ERROR.PROTOCOL_NOT_SUPPORTED) {
              resolve()
            } else {
              reject(e)
            }
          }
        })))
    }, [] as Promise<void>[])
    try {
      await Promise.all(promises)
    } catch (e) {
      throw e
    } finally {
      clean()
    }
  }
}

process.on('exit', () => {
  // tslint:disable-next-line: no-console
  console.log('program exit !')
  clean()
})

process.on('SIGINT', () => {
  // tslint:disable-next-line: no-console
  console.log('program SIGINT !')
  process.exit(0)
})

export default Downloader