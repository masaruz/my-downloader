import { v4 } from 'uuid'
import { parse } from 'url'
import { dirname, basename } from 'path'
import { removeSync, existsSync, unlinkSync, mkdirSync, readFileSync } from 'fs-extra'

import { ERROR, BASE } from './constants'
import { IOptions } from '@services/interfaces'

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
  const dir = `${BASE.PATH}/.${v4()}`
  ensureDirectoryExistence(dir)
  return dir
}

export function clean() {
  if (process.env.JEST_WORKER_ID) return
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

/**
 * resolve filename according to url
 * if destination is not provide then use process dir
 * @param url 
 * @param dest 
 */
export function getDestinationFromURL(url: string, dest?: string): string {
  if (!url) {
    throw new Error(ERROR.URL_IS_INVALID)
  }
  const parsed = parse(url)
  let filename = ''
  if (parsed.protocol && parsed.protocol !== null) {
    filename = `${parsed.protocol.substring(0, parsed.protocol.length - 1)}_${parsed.hostname}`
  }
  if (parsed.pathname !== '/') {
    if (filename) {
      filename = `${filename}_${basename(parsed.pathname)}`
    } else {
      filename = basename(parsed.pathname)
    }
  }
  let result = `${dest}/${filename}`
  if (!dest) {
    // if destination is not defined 
    // then defined as current dir
    result = `${process.cwd()}/${filename}`
  }
  ensureDirectoryExistence(result)
  return result
}

export function validateFileInput(pathname: string): IOptions[] {
  try {
    const data = readFileSync(pathname)
    const json = JSON.parse(data.toString())
    return json as IOptions[]
  } catch (e) {
    throw e
  }
}