import * as Multiprogress from 'multi-progress'
import { copyFileSync } from 'fs-extra'

import { IDownloaderFactory, IOptions } from './interfaces'
import { clean, validateURL, getDestinationFromURL, generateTempFilename, removeFile } from '@libs/utils'
import { ERROR } from '@libs/constants'

const multi = new Multiprogress(process.stderr)

class Downloader {
  private _factories: IDownloaderFactory[]

  register(factories: IDownloaderFactory[]) {
    this._factories = factories
  }

  private _checkIfSomeOfSourcesInvalid(options: IOptions[]) {
    // merge all supported protocols from all factories
    const allSupportedProtocols = this._factories.reduce((p, c) =>
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
    // throw error if found some of unsupported protocols in config
    this._checkIfSomeOfSourcesInvalid(options)
    // create each promise for each downloading 
    const promises = options.reduce((p, opt) =>
      p.concat(this._factories.map(factory => {
        return new Promise((resolve, rejects) => {
          try {
            // create a instance
            const dl = factory.createDownloader()
            validateURL(factory.supportedProtocols(), opt.url)
            dl.name = opt.url
            let b: ProgressBar
            dl.on('start', () => {
              b = multi.newBar(`${dl.name} [:bar] :percent :etas`, {
                complete: '=',
                incomplete: ' ',
                total: dl.size(),
              })
            })
            dl.on('progress', progress => {
              if (b) {
                b.tick(progress)
              }
            })
            // temporary destination until download finish
            dl.dest = generateTempFilename()
            dl.download({ ...opt, dir: dl.dest })
              // when download finish
              .then(() => {
                copyFileSync(dl.dest, getDestinationFromURL(opt.url, opt.dir))
                dl.dest = opt.dir
                dl.completed = true
                if (b) {
                  // for ensure 100% completed
                  b.tick(b.total)
                }
                resolve()
                // if any error
              }).catch(e => {
                // remove file if something wrong happend
                removeFile(dl.dest)
                // tslint:disable-next-line: no-console
                console.warn(`${dl.name} is failed to download ${e.message}`)
                resolve()
              })
          } catch (e) {
            if (e.message === ERROR.PROTOCOL_NOT_SUPPORTED) {
              return resolve()
            }
            return rejects(e)
          }
        })
      }))
      , [] as Promise<void>[])
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