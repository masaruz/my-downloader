import fetch from 'node-fetch'
import { createWriteStream, unlinkSync } from 'fs'

import { IDownloader, IOptions } from '@services/interfaces'
import { validateURL, getDestinationFromURL } from './utils'

import { ERROR } from './constants'

class Main implements IDownloader {
  private _done: boolean
  constructor() {
    this._done = true
  }

  download(options: IOptions) {
    validateURL(options.url)
    const dest = getDestinationFromURL(options.url, options.dest)
    this._done = false
    try {
      // request for downloading
      fetch(options.url).then(res => {
        const stream = createWriteStream(dest)
        res.body.pipe(stream)
        stream.on('close', () => {
          // this process is closed unproperly
          if (!this._done) {
            unlinkSync(dest)
          }
        })
        stream.on('finish', () => { this._done = true })
      })
    } catch (e) {
      // remove file is something wrong
      unlinkSync(dest)
      console.error(e)
    } finally {
      this._done = true
    }
  }
}

export default new Main()