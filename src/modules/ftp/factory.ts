import Downloader from '.'

import { IDownloader, IDownloaderFactory } from '@services/interfaces'

class Main implements IDownloaderFactory {
  createDownloader(): IDownloader {
    return new Downloader()
  }
  supportedProtocols(): string[] {
    return ['ftp:']
  }
}

export default Main
