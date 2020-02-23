import { v4 } from 'uuid'
import { dirname } from 'path'
import { removeSync, existsSync, unlinkSync, mkdirSync } from 'fs-extra'

const BASE_PATH = '.tmp'

/**
 * delete file in synchronously
 * @param pathname 
 */
export function removeFile(pathname: string) {
  if (existsSync(pathname)) {
    // remove file is something wrong
    unlinkSync(pathname)
  }
}

/**
 * create directory recursively if not exist
 * @param pathname 
 */
export function ensureDirectoryExistence(pathname: string): boolean {
  const dir = dirname(pathname)
  if (existsSync(dir)) {
    return true
  }
  ensureDirectoryExistence(dir)
  mkdirSync(dir)
}

export function generateTempFilename() {
  const dir = `${BASE_PATH}/${v4()}`
  ensureDirectoryExistence(dir)
  return dir
}

export function clean() {
  removeSync(BASE_PATH)
}