import * as Client from 'ssh2-sftp-client'
import { parse } from 'url'
import { copyFileSync, createWriteStream } from 'fs-extra'

import Base from '../base'
import { IDownloader, IOptions } from '@services/interfaces'
import { generateTempFilename, getDestinationFromURL } from '@libs/utils'
import { ERROR } from '@libs/constants'

class Main extends Base {
  supportedProtocols(): string[] {
    return ['sftp:']
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
      try {
        this.name = options.url
        const url = parse(options.url)
        const c = new Client()
        c.connect({
          host: url.host,
          username: options.username,
          password: options.password,
        })
          .then(() => c.stat(url.pathname))
          .then(stat => this._size = stat.size)
          .then(() => c.get(url.pathname, createWriteStream(this._dest)))
          .then(() => {
            c.end()
            resolve()
          })
          // tslint:disable-next-line: no-console
          .catch((e) => console.warn(`${this.name} is failed to download ${e.message}`))
      } catch (e) {
        rejects(e)
      }
    })
  }
}

export default Main