import { MultiBar, Presets, SingleBar } from 'cli-progress'
import { IDownloader, IOptions } from './interfaces'
import { clean } from '@libs/utils'

const multibar = new MultiBar({
  clearOnComplete: false,
  hideCursor: true,
}, Presets.shades_grey)

class Downloader {
  private _module: IDownloader

  register(module: IDownloader) {
    this._module = module
  }

  download(options: IOptions) {
    let b1: SingleBar
    this._module.download(options).then(() => {
      b1.update(this._module.size())
    }).catch(e => { throw e })
    this._module.on('start', () => {
      b1 = multibar.create(this._module.size(), 0, 'test')
    })
    this._module.on('progress', progress => {
      if (b1) {
        b1.update(progress)
      }
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