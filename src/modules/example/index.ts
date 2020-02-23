import Base from '../base'
import { IDownloader, IOptions } from '@services/interfaces'

class Main extends Base {
  factoryCreate(): IDownloader {
    throw new Error('Method not implemented.')
  }
  download(options: IOptions): Promise<void> {
    throw new Error('Method not implemented.')
  }
  supportedProtocols(): string[] {
    throw new Error('Method not implemented.')
  }

}

export default Main