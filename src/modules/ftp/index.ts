import * as Client from 'ftp'
import { parse } from 'url'
import { createWriteStream } from 'fs'

import Base from '../base'

import { IDownloader, IOptions } from '@services/interfaces'

import { generateTempFilename } from '@libs/utils'
import { ERROR } from '@libs/constants'

class Main extends Base {
  supportedProtocols(): string[] {
    return ['ftp:']
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
            stream.pipe(createWriteStream(this._dest))
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