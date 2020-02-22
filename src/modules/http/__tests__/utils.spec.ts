import { ERROR } from '../constants'
import { validateURL, getDestinationFromURL } from '../utils'

test('check url is wrong format', () => {
  expect(() => validateURL('')).toThrowError(ERROR.URL_IS_INVALID)
  expect(() => validateURL(null)).toThrowError(ERROR.URL_IS_INVALID)
  expect(() => validateURL('example.com')).toThrowError(ERROR.PROTOCOL_NOT_SUPPORTED)
  expect(() => validateURL('https:example')).toThrowError(ERROR.URL_IS_INVALID)
  expect(() => validateURL('https::example')).toThrowError(ERROR.URL_IS_INVALID)
  expect(() => validateURL('https:/example')).toThrowError(ERROR.URL_IS_INVALID)
})

test('url is correct format', () => {
  expect(() => validateURL('https://example')).not.toThrow()
  expect(() => validateURL('https://example.com/hello')).not.toThrow()
  expect(() => validateURL('https://example.com/hello?query=1')).not.toThrow()
  expect(() => validateURL('https://example.com/hello?a=1&b=2')).not.toThrow()
})

test('throw error when input is invalid', () => {
  expect(() => getDestinationFromURL('', '')).toThrowError(ERROR.URL_IS_INVALID)
  expect(() => getDestinationFromURL(null, null)).toThrowError(ERROR.URL_IS_INVALID)
})

test('handle input properly', () => {
  expect(getDestinationFromURL('https://example.com/hello.png', '')).toBe(`${process.cwd()}/hello.png`)
  expect(getDestinationFromURL('https://example.com/hello.png', null)).toBe(`${process.cwd()}/hello.png`)
  expect(getDestinationFromURL('https://example.com/hello.png', 'example_dir')).toBe(`example_dir/hello.png`)
  expect(getDestinationFromURL('https://example.com', 'example_dir')).toBe(`example_dir/example.com`)
  expect(getDestinationFromURL('https://example.com', null)).toBe(`${process.cwd()}/example.com`)
})