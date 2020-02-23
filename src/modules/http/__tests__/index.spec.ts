import http from '..'
import { ERROR } from '@libs/constants'
import { existsSync, removeSync } from 'fs-extra'

const source1 = { url: 'https://pngimage.net/wp-content/uploads/2018/05/example-of-png-8.png', dest: '.test' }
const source2 = { url: 'https://file-examples.com/wp-content/uploads/2017/10/file_example_JPG_100kB.jpg', dest: '.test' }

afterAll(() => {
  removeSync('.tmp')
  removeSync('.test')
})

test('specified url is null', () => {
  expect(new http().download({ url: null })).rejects.toEqual(Error(ERROR.URL_IS_INVALID))
})

test('download and remove file correctly', async () => {
  await new http().download(source1)
  expect(existsSync('.test/example-of-png-8.png')).toBeTruthy()
})

test('download and remove files correctly', async () => {
  await Promise.all([
    new http().download(source1),
    new http().download(source2),
  ])
  expect(existsSync('.test/example-of-png-8.png')).toBeTruthy()
  expect(existsSync('.test/file_example_JPG_100kB.jpg')).toBeTruthy()
})

test('able to get progress during download', async () => {
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






