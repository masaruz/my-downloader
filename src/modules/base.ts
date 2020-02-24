import { statSync } from 'fs'

import { IDownloader, IOptions } from '@services/interfaces'

abstract class Main implements IDownloader {
  private _oldSize: number

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

  get completed(): boolean {
    return this._completed
  }

  set completed(c: boolean) {
    this._completed = c
  }

  get dest(): string {
    return this._dest
  }

  set dest(d: string) {
    this._dest = d
  }

  abstract download(options: IOptions): Promise<void>

  isCompleted(): boolean {
    return this._completed
  }

  size(): number {
    return this._size
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
            const current = statSync(this._dest).size
            listener(current - this._oldSize)
            this._oldSize = current
          } catch (e) {
            listener(0)
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