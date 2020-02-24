import http from '..'
import { ERROR, BASE } from '@libs/constants'
import { existsSync, removeSync } from 'fs-extra'

const dir = `${BASE.PATH}_http`
const source1 = { url: 'https://pngimage.net/wp-content/uploads/2018/05/example-of-png-8.png', dir: `${dir}/1.png` }
const source2 = { url: 'https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_100kB.jpg', dir: `${dir}/2.png` }

afterAll(() => {
  removeSync(dir)
})

test('specified url is null', () => {
  expect(new http().download({ url: null })).rejects.toEqual(Error(ERROR.URL_IS_INVALID))
})

test('download and remove file correctly', async () => {
  await new http().download(source1)
  expect(existsSync(source1.dir)).toBeTruthy()
})

test('download and remove files correctly', async () => {
  await Promise.all([
    new http().download(source1),
    new http().download(source2),
  ])
  expect(existsSync(source1.dir)).toBeTruthy()
  expect(existsSync(source2.dir)).toBeTruthy()
}, 30000)

test('be able to get progress during download', async () => {
  const h = new http()
  h.on('progress', progress => {
    expect(typeof progress).toBe('number')
  })
  await h.download(source2)
})

test('able to get start event when download started', async () => {
  const h = new http()
  h.on('start', () => {
    expect(typeof h.size()).toBe('number')
  })
  await h.download(source2)
})






