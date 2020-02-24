import ftp from '..'
import { ERROR, BASE } from '@libs/constants'
import { existsSync, removeSync } from 'fs-extra'

const dir = `${BASE.PATH}_ftp`
const source1 = { url: 'ftp://speedtest.tele2.net/1KB.zip', dir: `${dir}/1.zip` }
const source2 = { url: 'ftp://speedtest.tele2.net/100KB.zip', dir: `${dir}/2.zip` }
const source3 = { url: 'ftp://speedtest.tele2.net/1MB.zip', dir: `${dir}/3.zip`, username: 'anonymous', password: 'anonymous' }
const source4 = { url: 'ftp://speedtest.tele2.net/100KB.zip', dir: `${dir}/4.zip`, username: 'wrong', password: 'wrong' }
const source5 = { url: 'ftp://example.example.tele2.net/1KB.zip', dir: `${dir}/5.zip` }
const source6 = { url: 'speedtest.tele2.net/1MB.zip', dir: `${dir}/6.zip` }

afterAll(() => {
  removeSync(dir)
})

test('specified url is null', () => {
  expect(new ftp().download({ url: null })).rejects.toEqual(Error(ERROR.URL_IS_INVALID))
})

test('download and remove file correctly', async () => {
  await new ftp().download(source1)
  expect(existsSync(source1.dir)).toBeTruthy()
})

test('download and remove files correctly', async () => {
  await Promise.all([
    new ftp().download(source1),
    new ftp().download(source2),
    new ftp().download(source3),
  ])
  expect(existsSync(source1.dir)).toBeTruthy()
  expect(existsSync(source2.dir)).toBeTruthy()
  expect(existsSync(source3.dir)).toBeTruthy()
})

test('use incorrect username/password should be failed', async () => {
  try {
    await new ftp().download(source4)
    throw new Error()
  } catch (e) {
    expect(e.message).not.toBe('')
  }
  expect(existsSync(source4.dir)).toBeFalsy()
})

test('use incorrect url should be failed', async () => {
  try {
    await new ftp().download(source5)
    throw new Error()
  } catch (e) {
    expect(e.message).not.toBe('')
  }
  expect(existsSync(source5.dir)).toBeFalsy()
})

test('missing protocol should be failed', async () => {
  try {
    await new ftp().download(source6)
    throw new Error()
  } catch (e) {
    expect(e.message).not.toBe('')
  }
  expect(existsSync(source6.dir)).toBeFalsy()
})

test('be able to get progress during download', async () => {
  const h = new ftp()
  h.on('progress', progress => {
    expect(typeof progress).toBe('number')
  })
  await h.download(source2)
})

test('able to get start event when download started', async () => {
  const h = new ftp()
  h.on('start', () => {
    expect(typeof h.size()).toBe('number')
  })
  await h.download(source2)
})





