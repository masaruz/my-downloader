import http from '..'
import { ERROR, BASE } from '@libs/constants'
import { existsSync, removeSync } from 'fs-extra'

const dir = `${BASE.PATH}_http`
const source1 = { url: 'https://pngimage.net/wp-content/uploads/2018/05/example-of-png-8.png', dir: `${dir}/1.png` }
const source2 = { url: 'http://speedtest.tele2.net/1KB.zip', dir: `${dir}/2.zip` }
const source3 = { url: 'http://speedtest.tele2.net/100KB.zip', dir: `${dir}/3.zip` }
const source4 = { url: 'http://example.example.net/1MB.zip', dir: `${dir}/4.zip` }
const source5 = { url: 'speedtest.tele2.net/1MB.zip', dir: `${dir}/5.zip` }

afterAll(() => {
  removeSync(dir)
})

test('specified url is null', () => {
  expect(new http().download({ url: null })).rejects.toEqual(Error(ERROR.URL_IS_INVALID))
})

test('download and remove files correctly', async () => {
  await Promise.all([
    new http().download(source1),
    new http().download(source2),
    new http().download(source3),
  ])
  expect(existsSync(source1.dir)).toBeTruthy()
  expect(existsSync(source2.dir)).toBeTruthy()
  expect(existsSync(source3.dir)).toBeTruthy()
})

test('use incorrect url but another process must be continued', async () => {
  try {
    await new http().download(source4)
    throw new Error()
  } catch (e) {
    expect(e.message).not.toBe('')
  }
  expect(existsSync(source4.dir)).toBeFalsy()
})

test('missing protocol download should be failed', async () => {
  try {
    await new http().download(source5)
    throw new Error()
  } catch (e) {
    expect(e.message).not.toBe('')
  }
  expect(existsSync(source5.dir)).toBeFalsy()
})

test('be able to get progress during download', async () => {
  const h = new http()
  h.on('progress', progress => {
    expect(typeof progress).toBe('number')
  })
  await h.download(source3)
})

test('able to get start event when download started', async () => {
  const h = new http()
  h.on('start', () => {
    expect(typeof h.size()).toBe('number')
  })
  await h.download(source3)
})






