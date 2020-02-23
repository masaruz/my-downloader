import { MultiBar, Presets, SingleBar } from 'cli-progress'
import { IDownloader, IOptions } from './interfaces'
import { clean, validateURL } from '@libs/utils'

const multibar = new MultiBar({
  clearOnComplete: false,
  hideCursor: true,
}, Presets.shades_grey)

class Downloader {
  private _module: IDownloader[]

  register(module: any) {
    this._module = module
  }

  async download(options: IOptions[]) {
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
              b = multibar.create(mod.size(), 0, 'test')
            })
            mod.on('progress', progress => {
              if (b) {
                b.update(progress)
              }
            })
          } catch (e) {
            reject(e)
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
  clean()
})

export default Downloader