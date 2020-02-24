import Downloader from '.'

import { IDownloader, IDownloaderFactory } from '@services/interfaces'

class Main implements IDownloaderFactory {
  supportedProtocols(): string[] {
    throw new Error('Method not implemented.')
  }
  createDownloader(): IDownloader {
    throw new Error('Method not implemented.')
  }
}

export default Main
