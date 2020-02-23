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

  download(options: IOptions[]) {
    const promises = this._module.reduce((p, c) => {
      return p.concat(options.map(opt => new Promise((resolve, reject) => {
        // create a instance
        const mod = c.factoryCreate()
        try {
          validateURL(mod.supportedProtocols(), opt.url)
          let b: SingleBar
          mod.download(opt).then(() => {
            b.update(mod.size())
            resolve()
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
    }, [])
    Promise.all(promises).then(() => {
      clean()
      console.log('done')
    })
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

export default new Downloader()