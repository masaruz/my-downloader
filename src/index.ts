// tslint:disable-next-line: no-submodule-imports
import 'module-alias/register'

import http from '@modules/http'
import d from '@services/core'

d.register(http)

d.download('www.google.com', '.')
