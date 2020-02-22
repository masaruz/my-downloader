import http from '..'
import { ERROR } from '../constants'

test('specified url is null', () => {
  expect(() => http.download({ url: null })).toThrowError(ERROR.URL_IS_INVALID)
})

test('check supported protocol', () => {
  expect(() => http.download({ url: 'ws://example.com' })).toThrowError(ERROR.PROTOCOL_NOT_SUPPORTED)
  expect(() => http.download({ url: 'wss://example.com' })).toThrowError(ERROR.PROTOCOL_NOT_SUPPORTED)
  expect(() => http.download({ url: 'ftp://example.com' })).toThrowError(ERROR.PROTOCOL_NOT_SUPPORTED)
  expect(() => http.download({ url: 'ftps://example.com' })).toThrowError(ERROR.PROTOCOL_NOT_SUPPORTED)
})




