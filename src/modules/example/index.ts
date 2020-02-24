import Base from '../base'
import { IOptions } from '@services/interfaces'

class Main extends Base {
  download(options: IOptions): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

export default Main