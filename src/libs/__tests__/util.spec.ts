import { existsSync, removeSync, mkdirSync } from 'fs-extra'
import { ensureDirectoryExistence } from '../utils'

const BASE_PATH = './util_spec'

beforeAll(() => {
  if (!existsSync(BASE_PATH)) {
    mkdirSync(BASE_PATH)
  }
  return
})

afterAll(() => {
  if (existsSync(BASE_PATH)) {
    // remove file is something wrong
    removeSync(BASE_PATH)
  }
  return
})

test('create dir if not exist', () => {
  const dir = `${BASE_PATH}/1/2/3/`
  ensureDirectoryExistence(`${dir}tmp.png`)
  expect(existsSync(dir)).toBeTruthy()
})

test('create dir if not exist', () => {
  const dir = `${BASE_PATH}/1/2 1/3/`
  ensureDirectoryExistence(`${dir}tmp.png`)
  expect(existsSync(dir)).toBeTruthy()
})