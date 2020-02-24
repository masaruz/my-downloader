import { IDownloaderFactory } from '@services/interfaces'
import http from './http/factory'
import ftp from './ftp/factory'
import sftp from './sftp/factory'

export default [
  new http,
  new ftp,
  new sftp,
] as IDownloaderFactory[]