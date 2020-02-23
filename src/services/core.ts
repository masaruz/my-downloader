import { MultiBar, Presets, SingleBar } from 'cli-progress'
import { IDownloader, IOptions } from './interfaces'
import { clean, validateURL } from '@libs/utils'
import { ERROR } from '@libs/constants'

const multibar = new MultiBar({
  format: '{source} | {bar} | {percentage}% || {value}/{total} B',
  clearOnComplete: false,
  hideCursor: true,
}, Presets.shades_grey)

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
            let b: SingleBar
            mod.download(opt)
              // when download finish
              .then(() => {
                if (b) {
                  b.update(mod.size())
                }
                resolve()
                // if any error
              }).catch(e => { throw e })
            mod.on('start', () => {
              b = multibar.create(mod.size(), 0, { source: '' })
            })
            mod.on('progress', progress => {
              if (b) {
                b.update(progress, { source: mod.name })
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