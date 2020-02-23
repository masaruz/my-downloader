import { ERROR } from '../constants'
import { getDestinationFromURL } from '../utils'

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