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
        throw new Error(ERROR.URL_IS_INVALID)
      }
      try {
        ensureDirectoryExistence(options.dir)
        const url = parse(options.url)
        const c = new Client()
        c.on('ready', () => {
          c.size(url.pathname, (err, size) => {
            if (err) throw err
            this._size = size
          })
          c.get(url.pathname, (err, stream) => {
            if (err) throw err
            stream.once('close', () => {
              c.end()
              resolve()
            })
            stream.pipe(createWriteStream(options.dir))
          })
        })
        // tslint:disable-next-line: no-console
        c.on('error', e => console.warn(`${this.name} is failed to download ${e.message}`))
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