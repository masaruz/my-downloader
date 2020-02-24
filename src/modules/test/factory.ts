import { IDownloader, IDownloaderFactory } from '@services/interfaces'
import { ERROR } from '@libs/constants'

class Main implements IDownloaderFactory {
  supportedProtocols(): string[] {
    // if your downloader support these protocols
    return ['http:', 'ftp:']
  }
  createDownloader(): IDownloader {
    throw new Error(ERROR.MODULE_IS_INVALID)
  }
}

export default Main
