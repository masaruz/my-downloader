export interface IOptions {
  url: string, // source of file
  dir?: string, // destination of this file, might be local disk
}

export interface IDownloader {
  name: string
  factoryCreate(): IDownloader
  download(options: IOptions): Promise<void>
  isCompleted(): boolean
  size(): number
  on(event: 'start', listener: () => void): void
  on(event: 'progress', listener: (progress: number) => void): void
  supportedProtocols(): string[]
}