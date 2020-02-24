import * as Client from 'ssh2-sftp-client'
import { parse } from 'url'
import { createWriteStream } from 'fs-extra'

import Base from '../base'
import { IOptions } from '@services/interfaces'
import { ERROR } from '@libs/constants'

class Main extends Base {
  download(options: IOptions): Promise<void> {
    return new Promise((resolve, rejects) => {
      if (!options.url) {
        rejects(new Error(ERROR.URL_IS_INVALID))
      }
      try {
        const url = parse(options.url)
        const c = new Client()
        c.connect({
          host: url.host,
          username: options.username,
          password: options.password,
        })
          .then(() => c.stat(url.pathname))
          .then(stat => this._size = stat.size)
          .then(() => c.get(url.pathname, createWriteStream(options.dir)))
          .then(() => {
            c.end()
            resolve()
          })
          .catch(e => { rejects(e) })
      } catch (e) {
        // just ignore and let another process do thier job
        rejects(e)
      }
    })
  }
}

export default Main