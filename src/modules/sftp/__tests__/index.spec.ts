import sftp from '..'
import { ERROR, BASE } from '@libs/constants'
import { existsSync, removeSync } from 'fs-extra'

const dir = `${BASE.PATH}_sftp`
const source1 = { url: 'sftp://test.rebex.net/readme.txt', dir: `${dir}/1.txt` }
const source2 = { url: 'sftp://test.rebex.net/readme.txt', dir: `${dir}/2.txt`, username: 'demo', password: 'password' }
const source3 = { url: 'sftp://test.rebex.net/readme.txt', dir: `${dir}/3.txt`, username: 'wrong', password: 'wrong' }
const source4 = { url: 'sftp://example.example.tele2.net/readme.txt', dir: `${dir}/4.txt` }
const source5 = { url: 'test.rebex.net/readme.txt', dir: `${dir}/5.txt` }

afterAll(() => {
  removeSync(dir)
})

test('specified url is null', () => {
  expect(new sftp().download({ url: null })).rejects.toEqual(Error(ERROR.URL_IS_INVALID))
})

test('no username/password should be fail', async () => {
  try {
    await new sftp().download(source1)
    throw new Error()
  } catch (e) {
    expect(e.message).not.toBe('')
  }
  expect(existsSync(source1.dir)).toBeFalsy()
})

test('download and remove file correctly', async () => {
  await new sftp().download(source2)
  expect(existsSync(source2.dir)).toBeTruthy()
})

test('use incorrect username/password should be failed', async () => {
  try {
    await new sftp().download(source3)
    throw new Error()
  } catch (e) {
    expect(e.message).not.toBe('')
  }
  expect(existsSync(source3.dir)).toBeFalsy()
})

test('use incorrect url should be failed', async () => {
  try {
    await new sftp().download(source4)
    throw new Error()
  } catch (e) {
    expect(e.message).not.toBe('')
  }
  expect(existsSync(source4.dir)).toBeFalsy()
})

test('missing protocol should be failed', async () => {
  try {
    await new sftp().download(source5)
    throw new Error()
  } catch (e) {
    expect(e.message).not.toBe('')
  }
  expect(existsSync(source5.dir)).toBeFalsy()
})

test('be able to get progress during download', async () => {
  const h = new sftp()
  h.on('progress', progress => {
    expect(typeof progress).toBe('number')
  })
  await h.download(source2)
})

test('able to get start event when download started', async () => {
  const h = new sftp()
  h.on('start', () => {
    expect(typeof h.size()).toBe('number')
  })
  await h.download(source2)
})
