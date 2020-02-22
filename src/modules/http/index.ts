import fetch from 'node-fetch'
import { v4 } from 'uuid'
import { createWriteStream, renameSync } from 'fs'

import { IDownloader, IOptions } from '@services/interfaces'
import { removeFile } from '@libs/utils'

import { validateURL, getDestinationFromURL } from './utils'

class Main implements IDownloader {
  private _done: boolean
  private _size: string
  constructor() {
    this._done = true
  }

  progress(): number {
    return 0
  }

  isDone(): boolean {
    return this._done
  }

  download(options: IOptions) {
    const temp = `.${v4()}`
    try {
      validateURL(options.url)
      // temporary destination until download finish
      this._done = false
      // request for downloading
      fetch(options.url).then(res => {
        const stream = createWriteStream(temp)
        this._size = res.headers.get('content-length')
        res.body.pipe(stream)
        stream.on('close', () => {
          // this process is closed unproperly
          if (!this._done) {
            removeFile(temp)
          }
        })
        stream.on('finish', () => {
          renameSync(temp, getDestinationFromURL(options.url, options.dest))
          this._done = true
        })
      })
    } catch (e) {
      // remove file is something wrong
      removeFile(temp)
      throw e
    } finally {
      this._done = true
    }
  }
}

export default new Main()