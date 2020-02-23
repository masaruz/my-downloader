import http from '..'
import { IDownloader } from '@services/interfaces'
import { ERROR } from '@libs/constants'

let md: IDownloader
beforeAll(() => {
  md = new http()
})

afterAll(() => {
  md = null
})

test('specified url is null', () => {
  expect(md.download({ url: null })).rejects.toEqual(Error(ERROR.URL_IS_INVALID))
})






