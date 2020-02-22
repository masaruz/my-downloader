import { MultiBar, Presets } from 'cli-progress'
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
    this._module.download(options).catch(e => { throw e })
    this._module.on('progress', progress => console.log(progress))
  }
}

export default new Downloader()