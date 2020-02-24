import Base from '../base'
import { IOptions } from '@services/interfaces'

class Main extends Base {
  download(options: IOptions): Promise<void> {
    return new Promise((resolve, rejects) => {
      // your connection go here ...
    })
  }
}

export default Main