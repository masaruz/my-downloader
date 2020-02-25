import { EventEmitter } from 'events'

export interface IOptions {
  url: string, // source of file
  dir?: string, // destination of this file, might be local disk
  username?: string,
  password?: string,
}

export interface IDownloaderFactory {
  createDownloader(): IDownloader
  supportedProtocols(): string[]
}

export abstract class IDownloader extends EventEmitter {
  name: string
  dest: string
  abstract download(options: IOptions): Promise<void>
  abstract size(): number
}