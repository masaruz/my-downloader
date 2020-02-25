import { statSync } from 'fs'

import { IDownloader, IOptions } from '@services/interfaces'
import { EVENT } from '@libs/constants'

abstract class Main extends IDownloader {
  private _oldSize: number

  protected _start: boolean
  protected _completed: boolean
  protected _size: number
  protected _dest: string
  protected _name: string

  protected _startCallback: () => void

  constructor() {
    super()
    this._size = -1
    this.setMaxListeners(10)
    // set interval to emit event
    const interval = setInterval(() => {
      try {
        const current = statSync(this._dest).size
        this.emit(EVENT.PROGRESS, current - this._oldSize)
        this._oldSize = current
      } catch (e) {
        this.emit(EVENT.PROGRESS, 0)
      }
    }, 100)
    this.on(EVENT.COMPLETED, () => {
      // if completed then send 100% to listener
      this.emit(EVENT.PROGRESS, this.size())
      clearInterval(interval)
    })
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

  size(): number {
    return this._size
  }
}

export default Main