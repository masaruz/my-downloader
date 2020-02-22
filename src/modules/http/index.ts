import fetch from 'node-fetch'
import { v4 } from 'uuid'
import { createWriteStream, renameSync, statSync } from 'fs'

import { IDownloader, IOptions } from '@services/interfaces'
import { removeFile } from '@libs/utils'

import { validateURL, getDestinationFromURL } from './utils'

class Main implements IDownloader {
  private _completed: boolean
  private _size: number
  private _dest: string

  isCompleted(): boolean {
    return this._completed
  }

  on(event: 'progress', listener: (progress: number) => void): void {
    const interval = setInterval(() => {
      try {
        const stats = statSync(this._dest)
        listener(stats.size / this._size)
      } catch (e) {
        listener(-1)
      }
      if (this._completed) {
        clearInterval(interval)
      }
    }, 100)
  }

  async download(options: IOptions): Promise<void> {
    return new Promise((resolve, rejects) => {
      this._dest = `.${v4()}`
      try {
        validateURL(options.url)
        // temporary destination until download finish
        this._completed = false
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
            renameSync(this._dest, getDestinationFromURL(options.url, options.dest))
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

export default new Main()