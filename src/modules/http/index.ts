import fetch from 'node-fetch'
import { createWriteStream, copyFileSync, statSync } from 'fs'

import { IDownloader, IOptions } from '@services/interfaces'
import { removeFile, generateTempFilename } from '@libs/utils'

import { getDestinationFromURL } from './utils'

class Main implements IDownloader {
  private _start: boolean
  private _completed: boolean
  private _size: number
  private _dest: string

  private _startCallback: () => void

  constructor() {
    this._size = -1
  }

  factoryCreate(): IDownloader {
    return new Main()
  }

  supportedProtocols(): string[] {
    return ['http:', 'https:']
  }

  size(): number {
    return this._size
  }

  isCompleted(): boolean {
    return this._completed
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

  async download(options: IOptions): Promise<void> {
    return new Promise((resolve, rejects) => {
      // temporary destination until download finish
      this._dest = generateTempFilename()
      try {
        // request for downloading
        fetch(options.url).then(res => {
          const stream = createWriteStream(this._dest)
          // read size from header
          this._size = parseInt(res.headers.get('content-length'), 10)
          // start write stream
          res.body.pipe(stream)
          stream.on('close', () => {
            // this process is closed unproperly
            if (!this._completed) {
              removeFile(this._dest)
            }
          })
          stream.on('finish', () => {
            copyFileSync(this._dest, getDestinationFromURL(options.url, options.dest))
            this._dest = options.dest
            this._completed = true
            resolve()
          })
        })
      } catch (e) {
        // remove file is something wrong
        removeFile(this._dest)
        rejects(e)
      }
    })
  }
}

export default Main