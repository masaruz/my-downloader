export interface IOptions {
  url: string, // source of file
  dest?: string, // destination of this file, might be local disk
}

export interface IDownloader {
  download(options: IOptions): Promise<void>
  isCompleted(): boolean
  on(event: 'progress', listener: (progress: number) => void): void
}