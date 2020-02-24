import Downloader from '.'

import { IDownloader, IDownloaderFactory } from '@services/interfaces'

class Main implements IDownloaderFactory {
  supportedProtocols(): string[] {
    return ['sftp:']
  }
  createDownloader(): IDownloader {
    return new Downloader()
  }
}

export default Main
