import * as Client from 'ftp'
import { parse } from 'url'
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
      try {
        ensureDirectoryExistence(options.dir)
        const url = parse(options.url)
        const c = new Client()
        c.on('ready', () => {
          c.size(url.pathname, (e, size) => {
            if (e) rejects(e)
            this._size = size
          })
          c.get(url.pathname, (e, stream) => {
            if (e) rejects(e)
            stream.once('close', () => {
              c.end()
              resolve()
            })
            stream.pipe(createWriteStream(options.dir))
          })
        })
        c.on('error', e => { rejects(e) })
        c.connect({
          host: url.host,
          user: options.username,
          password: options.password,
        })
      } catch (e) {
        rejects(e)
      }
    })
  }
}

export default Main