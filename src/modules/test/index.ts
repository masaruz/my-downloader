import Base from '../base'
import { IOptions } from '@services/interfaces'
import { ERROR } from '@libs/constants'

class Main extends Base {
  download(options: IOptions): Promise<void> {
    return new Promise((resolve, rejects) => {
      rejects(new Error(ERROR.MODULE_IS_INVALID))
    })
  }
}

export default Main