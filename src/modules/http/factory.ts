import Downloader from '.'

import { IDownloader, IDownloaderFactory } from '@services/interfaces'

class Main implements IDownloaderFactory {
  supportedProtocols(): string[] {
    return ['http:', 'https:']
  }
  createDownloader(): IDownloader {
    return new Downloader()
  }
}

export default Main
