import ftp from '..'
import { ERROR, BASE } from '@libs/constants'
import { existsSync, removeSync } from 'fs-extra'

const dir = `${BASE.PATH}_ftp`
const source1 = { url: 'ftp://speedtest.tele2.net/1KB.zip', dir }
const source2 = { url: 'ftp://speedtest.tele2.net/1MB.zip', dir }

afterAll(() => {
  removeSync(dir)
})

test('specified url is null', () => {
  expect(new ftp().download({ url: null })).rejects.toEqual(Error(ERROR.URL_IS_INVALID))
})

test('download and remove file correctly', async () => {
  await new ftp().download(source1)
  expect(existsSync(`${dir}/1KB.zip`)).toBeTruthy()
})

test('download and remove files correctly', async () => {
  await Promise.all([
    new ftp().download(source1),
    new ftp().download(source2),
  ])
  expect(existsSync(`${dir}/1KB.zip`)).toBeTruthy()
  expect(existsSync(`${dir}/1MB.zip`)).toBeTruthy()
}, 30000)

test('be able to get progress during download', async () => {
  const h = new ftp()
  h.on('progress', progress => {
    expect(typeof progress).toBe('number')
  })
  await h.download(source2)
}, 30000)

test('able to get start event when download started', async () => {
  const h = new ftp()
  h.on('start', () => {
    expect(typeof h.size()).toBe('number')
  })
  await h.download(source2)
}, 30000)






