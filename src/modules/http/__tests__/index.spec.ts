import http from '..'
import { ERROR } from '../constants'
import { IDownloader } from '@services/interfaces'

let md: IDownloader
beforeAll(() => {
  md = new http()
})

afterAll(() => {
  md = null
})

test('specified url is null', () => {
  expect(md.download({ url: null })).rejects.toEqual(ERROR.URL_IS_INVALID)
})

test('check supported protocol', () => {
  expect(md.download({ url: 'ws://example.com' })).rejects.toEqual(ERROR.PROTOCOL_NOT_SUPPORTED)
  expect(md.download({ url: 'wss://example.com' })).rejects.toEqual(ERROR.PROTOCOL_NOT_SUPPORTED)
  expect(md.download({ url: 'ftp://example.com' })).rejects.toEqual(ERROR.PROTOCOL_NOT_SUPPORTED)
  expect(md.download({ url: 'ftps://example.com' })).rejects.toEqual(ERROR.PROTOCOL_NOT_SUPPORTED)
})





