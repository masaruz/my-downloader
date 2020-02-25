import * as Client from 'ssh2-sftp-client'
import { parse } from 'url'
import { createWriteStream } from 'fs-extra'

import Base from '../base'
import { IOptions } from '@services/interfaces'
import { ERROR } from '@libs/constants'
import { ensureDirectoryExistence } from '@libs/utils'

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
        c.connect({
          host: url.host,
          username: options.username,
          password: options.password,
        })
          .then(() => c.stat(url.pathname))
          .then(stat => {
            this._size = stat.size
            this.emit('start', this._size)
          })
          .then(() => c.get(url.pathname, createWriteStream(options.dir)))
          .then(() => {
            c.end()
            resolve()
          })
          .catch(rejects)
      } catch (e) {
        rejects(e)
      }
    })
  }
}

export default Main