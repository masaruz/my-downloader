import modules from '@modules'
import Core from '@services/core'
import { ERROR, BASE } from '@libs/constants'
import { existsSync, removeSync } from 'fs-extra'

const dir = `${BASE.PATH}_core`
const source1 = { url: 'https://pngimage.net/wp-content/uploads/2018/05/example-of-png-8.png', dest: dir }
const source2 = { url: 'https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_100kB.jpg', dest: dir }

afterAll(() => {
  removeSync(dir)
})

test('check all input are not supported protocols', async () => {
  const c = new Core()
  c.register(modules)
  try {
    await c.start([
      { url: 'xxx://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1920_18MG.mp4', dir: '/Users/_/Downloads' },
      { url: 'sss://file-examples.com/wp-content/uploads/2017/11/file_example_WAV_10MG.wav' },
    ])
    throw new Error()
  } catch (e) {
    expect(e.message).toBe(ERROR.PROTOCOL_NOT_SUPPORTED)
  }
})

test('check some input are supported protocols', async () => {
  const c = new Core()
  c.register(modules)
  try {
    await c.start([
      { url: 'xxx://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1920_18MG.mp4', dir: '/Users/_/Downloads' },
      { url: 'sss://file-examples.com/wp-content/uploads/2017/11/file_example_WAV_10MG.wav' },
      source1,
    ])
    throw new Error()
  } catch (e) {
    expect(e.message).toBe(ERROR.PROTOCOL_NOT_SUPPORTED)
  }
})

test('download and remove files correctly', async () => {
  const c = new Core()
  c.register(modules)
  await c.start([source1, source2])
  expect(existsSync(`${dir}/example-of-png-8.png`)).toBeTruthy()
  expect(existsSync(`${dir}/file_example_JPG_100kB.jpg`)).toBeTruthy()
})