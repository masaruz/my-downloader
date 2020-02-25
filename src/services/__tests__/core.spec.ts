import modules from '@modules'
import Core from '@services/core'
import { ERROR, BASE } from '@libs/constants'
import { existsSync, removeSync } from 'fs-extra'
import testModule from '@modules/test/factory'

const dir = `${BASE.PATH}_core`
const source1 = { url: 'https://pngimage.net/wp-content/uploads/2018/05/example-of-png-8.png', dir }
const source2 = { url: 'https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_100kB.jpg', dir }
const source3 = { url: 'ftp://speedtest.tele2.net/1MB.zip', dir, username: 'anonymous', password: 'anonymous' }
const source4 = { url: 'ftp://speedtest.tele2.net/100KB.zip', dir, username: 'wrong', password: 'wrong' }
const source5 = { url: 'ftp://example.example.tele2.net/1KB.zip', dir }

afterAll(() => {
  removeSync(dir)
  removeSync(BASE.PATH)
})

test('import invalid or unimplemented module', async () => {
  const c = new Core()
  c.register([new testModule()])
  try {
    await c.start([
      { url: 'http://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_1920_18MG.mp4', dir: '/Users/_/Downloads' },
    ])
    throw new Error()
  } catch (e) {
    expect(e.message).toBe(ERROR.MODULE_IS_INVALID)
  }
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
  await c.start([source1, source2, source3, source4, source5])
  expect(existsSync(`${dir}/https_pngimage.net_example-of-png-8.png`)).toBeTruthy()
  expect(existsSync(`${dir}/https_file-examples.com_file_example_JPG_100kB.jpg`)).toBeTruthy()
  expect(existsSync(`${dir}/ftp_speedtest.tele2.net_1MB.zip`)).toBeTruthy()
  expect(existsSync(`${dir}/ftp_speedtest.tele2.net_100KB.zip`)).toBeFalsy()
  expect(existsSync(`${dir}/ftp_example.example.tele2.net_1KB.zip`)).toBeFalsy()
})