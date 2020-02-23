import modules from '@modules'
import Core from '@services/core'
import { ERROR } from '@libs/constants'

test('check supported protocol', async () => {
  const c = new Core()
  c.register(modules)
  try {
    await c.download([
      { url: 'xxx://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1920_18MG.mp4', dest: '/Users/stamp/Downloads' },
      { url: 'sss://file-examples.com/wp-content/uploads/2017/11/file_example_WAV_10MG.wav' },
    ])
    throw new Error()
  } catch (e) {
    expect(e.message).toBe(ERROR.PROTOCOL_NOT_SUPPORTED)
  }
})