import http from '..'
import { ERROR } from '../constants'

test('specified url is null', () => {
  expect(http.download({ url: null })).rejects.toEqual(ERROR.URL_IS_INVALID)
})

test('check supported protocol', () => {
  expect(http.download({ url: 'ws://example.com' })).rejects.toEqual(ERROR.PROTOCOL_NOT_SUPPORTED)
  expect(http.download({ url: 'wss://example.com' })).rejects.toEqual(ERROR.PROTOCOL_NOT_SUPPORTED)
  expect(http.download({ url: 'ftp://example.com' })).rejects.toEqual(ERROR.PROTOCOL_NOT_SUPPORTED)
  expect(http.download({ url: 'ftps://example.com' })).rejects.toEqual(ERROR.PROTOCOL_NOT_SUPPORTED)
})





