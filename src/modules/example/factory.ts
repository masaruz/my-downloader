import Downloader from '.'

import { IDownloader, IDownloaderFactory } from '@services/interfaces'

class Main implements IDownloaderFactory {
  supportedProtocols(): string[] {
    // if your downloader support these protocols
    return ['http:', 'ftp:']
  }
  createDownloader(): IDownloader {
    return new Downloader()
  }
}

export default Main
