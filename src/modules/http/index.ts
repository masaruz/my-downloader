import { IDownloader } from '@services/interfaces'

class Main implements IDownloader {
  download(url: string) {
    console.log(`downloading from ${url}`)
  }
}

export default new Main()