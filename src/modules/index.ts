import { IDownloader } from '@services/interfaces'
import http from './http'
import ftp from './ftp'
import sftp from './sftp'

export default [
  new http,
  new ftp,
  new sftp,
] as IDownloader[]