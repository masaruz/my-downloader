// tslint:disable-next-line: no-submodule-imports
import 'module-alias/register'

import http from '@modules/http'
import d from '@services/core'

d.register(http)

// d.download({ url: 'https://pngimage.net/wp-content/uploads/2018/05/example-of-png-8.png' })
// d.download({ url: 'https://file-examples.com/wp-content/uploads/2017/11/file_example_WAV_10MG.wav' })
d.download({ url: 'https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_100kB.jpg' })
