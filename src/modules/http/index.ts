import fetch from 'node-fetch'
import { createWriteStream } from 'fs'

import Base from '../base'

import { IOptions } from '@services/interfaces'
import { ensureDirectoryExistence } from '@libs/utils'
import { ERROR } from '@libs/constants'

class Main extends Base {
  download(options: IOptions): Promise<void> {
    return new Promise((resolve, rejects) => {
      if (!options.url) {
        rejects(new Error(ERROR.URL_IS_INVALID))
      }
      // request for downloading
      fetch(options.url).then(res => {
        ensureDirectoryExistence(options.dir)
        const stream = createWriteStream(options.dir)
        // read size from header
        this._size = parseInt(res.headers.get('content-length'), 10)
        // start write stream
        res.body.pipe(stream)
        stream.on('finish', () => {
          resolve()
        })
        stream.on('error', e => { rejects(e) })
      }).catch(e => {
        // just ignore and let another process do thier job
        rejects(e)
      })
    })
  }
}

export default Main