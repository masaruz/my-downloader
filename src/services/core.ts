import * as Multiprogress from 'multi-progress'
import { IDownloader, IOptions } from './interfaces'
import { clean, validateURL } from '@libs/utils'
import { ERROR } from '@libs/constants'

const multi = new Multiprogress(process.stderr)

class Downloader {
  private _module: IDownloader[]

  register(module: any) {
    this._module = module
  }

  async start(options: IOptions[]) {
    const promises = this._module.reduce((p, c) => {
      return p.concat(options.map(opt =>
        // create each promise for each downloading 
        new Promise((resolve, reject) => {
          // create a instance
          const mod = c.factoryCreate()
          try {
            validateURL(mod.supportedProtocols(), opt.url)
            let b: ProgressBar
            mod.download(opt)
              // when download finish
              .then(() => {
                if (b) {
                  b.tick(mod.size())
                }
                resolve()
                // if any error
              }).catch(e => { throw e })
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
          } catch (e) {
            // TODO: do nothing when protocol not support 
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
      clean()
    } catch (e) {
      throw e
    }
  }
}

process.on('exit', () => {
  console.log('program exit !')
  clean()
})

process.on('SIGINT', () => {
  console.log('program SIGINT !')
  process.exit(0)
})

export default Downloader