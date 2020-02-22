import { MultiBar } from 'cli-progress'
import { IDownloader, IOptions } from './interfaces'

class Downloader {
  private _module: IDownloader

  register(module: IDownloader) {
    this._module = module
  }

  download(options: IOptions) {
    this._module.download(options)
  }
}

export default new Downloader()