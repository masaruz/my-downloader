import { IDownloader } from './interfaces'

class Downloader {
  private _module: IDownloader

  register(module: IDownloader) {
    this._module = module
  }

  download(url: string, dest: string) {
    this._module.download(url)
  }
}

export default new Downloader()