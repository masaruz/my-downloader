import { MultiBar, Presets, SingleBar } from 'cli-progress'
import { IDownloader, IOptions } from './interfaces'

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
    this._module.download(options).then(() => { process.exit(0) }).catch(e => { throw e })
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

export default new Downloader()