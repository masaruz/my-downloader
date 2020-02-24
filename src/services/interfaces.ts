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

export interface IDownloader {
  name: string
  completed: boolean
  dest: string
  download(options: IOptions): Promise<void>
  isCompleted(): boolean
  size(): number
  on(event: 'start', listener: () => void): void
  on(event: 'progress', listener: (progress: number) => void): void
}