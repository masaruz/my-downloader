import fetch from 'node-fetch'
import { createWriteStream } from 'fs'

import Base from '../base'

import { IDownloader, IOptions } from '@services/interfaces'
import { removeFile, generateTempFilename } from '@libs/utils'
import { ERROR } from '@libs/constants'

class Main extends Base {
  supportedProtocols(): string[] {
    return ['http:', 'https:']
  }

  factoryCreate(): IDownloader {
    return new Main()
  }

  download(options: IOptions): Promise<void> {
    return new Promise((resolve, rejects) => {
      // temporary destination until download finish
      this._dest = generateTempFilename()
      if (!options.url) {
        throw new Error(ERROR.URL_IS_INVALID)
      }
      // request for downloading
      fetch(options.url).then(res => {
        const stream = createWriteStream(this._dest)
        // read size from header
        this._size = parseInt(res.headers.get('content-length'), 10)
        // start write stream
        res.body.pipe(stream)
        stream.on('close', () => {
          // if process is closed unproperly
          if (!this._completed) {
            removeFile(this._dest)
          }
        })
        stream.on('finish', () => {
          resolve()
        })
        // tslint:disable-next-line: no-console
        stream.on('error', e => console.warn(`${this.name} is failed to download ${e.message}`))
      }).catch(e => {
        // remove file if something wrong happend
        removeFile(this._dest)
        rejects(e)
      })
    })
  }
}

export default Main