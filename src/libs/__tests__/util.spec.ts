import { existsSync, removeSync, mkdirSync } from 'fs-extra'
import { ensureDirectoryExistence, validateURL, getDestinationFromURL } from '../utils'
import { ERROR } from '../constants'

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

test('check url is wrong format', () => {
  expect(() => validateURL(['http:', 'https:'], '')).toThrowError(ERROR.URL_IS_INVALID)
  expect(() => validateURL(['http:', 'https:'], null)).toThrowError(ERROR.URL_IS_INVALID)
  expect(() => validateURL(['http:', 'https:'], 'example.com')).toThrowError(ERROR.PROTOCOL_NOT_SUPPORTED)
  expect(() => validateURL(['http:', 'https:'], 'https:example')).toThrowError(ERROR.URL_IS_INVALID)
  expect(() => validateURL(['http:', 'https:'], 'https::example')).toThrowError(ERROR.URL_IS_INVALID)
  expect(() => validateURL(['http:', 'https:'], 'https:/example')).toThrowError(ERROR.URL_IS_INVALID)
  expect(() => validateURL(['ws:'], 'ws:/example')).toThrowError(ERROR.URL_IS_INVALID)
  expect(() => validateURL(['ftp:', 'sftp:'], 'ftps://example.com/hello?a=1&b=2')).toThrowError(ERROR.PROTOCOL_NOT_SUPPORTED)
  expect(() => validateURL(['ftp:', 'sftp:'], 'sftpd://example.com/hello?a=1&b=2')).toThrowError(ERROR.PROTOCOL_NOT_SUPPORTED)
})

test('url is correct format', () => {
  expect(() => validateURL(['http:', 'https:'], 'https://example')).not.toThrow()
  expect(() => validateURL(['http:', 'https:'], 'https://example.com/hello')).not.toThrow()
  expect(() => validateURL(['http:', 'https:'], 'https://example.com/hello?query=1')).not.toThrow()
  expect(() => validateURL(['http:', 'https:'], 'https://example.com/hello?a=1&b=2')).not.toThrow()
  expect(() => validateURL(['ws:', 'wss:'], 'ws://example.com/hello?a=1&b=2')).not.toThrow()
  expect(() => validateURL(['ws:', 'wss:'], 'wss://example.com/hello?a=1&b=2')).not.toThrow()
  expect(() => validateURL(['ftp:', 'sftp:'], 'ftp://example.com/hello?a=1&b=2')).not.toThrow()
  expect(() => validateURL(['ftp:', 'sftp:'], 'sftp://example.com/hello?a=1&b=2')).not.toThrow()
})


test('throw error when input is invalid', () => {
  expect(() => getDestinationFromURL('', '')).toThrowError(ERROR.URL_IS_INVALID)
  expect(() => getDestinationFromURL(null, null)).toThrowError(ERROR.URL_IS_INVALID)
})

test('create name of file base on url', () => {
  expect(getDestinationFromURL('https://example.com/hello.png', '')).toBe(`${process.cwd()}/https_example.com_hello.png`)
  expect(getDestinationFromURL('https://example.com/hello.png', null)).toBe(`${process.cwd()}/https_example.com_hello.png`)
  expect(getDestinationFromURL('https://example.com/hello.png', BASE_PATH)).toBe(`${BASE_PATH}/https_example.com_hello.png`)
  expect(getDestinationFromURL('https://example.com', BASE_PATH)).toBe(`${BASE_PATH}/https_example.com`)
  expect(getDestinationFromURL('https://example.com', null)).toBe(`${process.cwd()}/https_example.com`)
  expect(getDestinationFromURL('example.com', null)).toBe(`${process.cwd()}/example.com`)
})