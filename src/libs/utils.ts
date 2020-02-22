import { existsSync, unlinkSync } from 'fs'

export function removeFile(pathname: string) {
  if (existsSync(pathname)) {
    // remove file is something wrong
    unlinkSync(pathname)
  }
}