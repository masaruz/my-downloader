import { statSync } from 'fs'

import { IDownloader, IOptions } from '@services/interfaces'

class Main implements IDownloader {

  protected _start: boolean
  protected _completed: boolean
  protected _size: number
  protected _dest: string
  protected _name: string

  protected _startCallback: () => void

  constructor() {
    this._size = -1
  }

  get name(): string {
    return this._name
  }

  set name(n: string) {
    this._name = n
  }

  factoryCreate(): IDownloader {
    throw new Error('Method not implemented.')
  }

  download(options: IOptions): Promise<void> {
    throw new Error('Method not implemented.')
  }

  isCompleted(): boolean {
    return this._completed
  }

  size(): number {
    return this._size
  }

  supportedProtocols(): string[] {
    throw new Error('Method not implemented.')
  }

  on(event: 'start' | 'progress', listener: (progress?: number) => void): void {
    switch (event) {
      case 'start':
        this._startCallback = listener
        break
      case 'progress':
        // set interval to call listener
        const interval = setInterval(() => {
          if (this._startCallback && this._size > 0 && !this._start) {
            this._startCallback()
            // no call twice
            this._start = true
          }
          try {
            listener(statSync(this._dest).size)
          } catch (e) {
            listener(-1)
          }
          if (this._completed) {
            // if completed then send 100% to listener
            listener(this._size)
            clearInterval(interval)
          }
        }, 100)
        break
    }
  }
}

export default Main