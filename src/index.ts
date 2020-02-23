// tslint:disable-next-line: no-submodule-imports
import 'module-alias/register'

import modules from '@modules/index'
import d from '@services/core'

d.register(modules)

// d.download({ url: 'https://pngimage.net/wp-content/uploads/2018/05/example-of-png-8.png' })
// d.download({ url: 'https://file-examples.com/wp-content/uploads/2017/11/file_example_WAV_10MG.wav' })
// d.download({ url: 'https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_100kB.jpg', dest: '/Users/stamp/Downloads' })
// d.download([
//   { url: 'https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1920_18MG.mp4', dest: '/Users/stamp/Downloads' },
//   { url: 'https://file-examples.com/wp-content/uploads/2017/11/file_example_WAV_10MG.wav' },
// ])
