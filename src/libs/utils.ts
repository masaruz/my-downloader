import { v4 } from 'uuid'
import { parse } from 'url'
import { dirname } from 'path'
import { removeSync, existsSync, unlinkSync, mkdirSync } from 'fs-extra'

import { ERROR, BASE } from './constants'

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
  const dir = `${BASE.PATH}/${v4()}`
  ensureDirectoryExistence(dir)
  return dir
}

export function clean() {
  removeSync(BASE.PATH)
}

/**
 * throw some errors if url is not valid for this module
 * @param url 
 */
export function validateURL(protocols: string[], url: string) {
  if (!url) {
    throw new Error(ERROR.URL_IS_INVALID)
  }
  const parsed = parse(url)
  if (!protocols.includes(parsed.protocol)) {
    throw new Error(ERROR.PROTOCOL_NOT_SUPPORTED)
  }
  if (!parsed.hostname || !parsed.host) {
    throw new Error(ERROR.URL_IS_INVALID)
  }
}