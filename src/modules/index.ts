import { IDownloader } from '@services/interfaces'
import http from './http'
import ftp from './ftp'

export default [
  new http,
  new ftp,
] as IDownloader[]