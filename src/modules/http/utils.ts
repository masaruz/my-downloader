import { parse } from 'url'
import { basename } from 'path'

import { ERROR } from './constants'

/**
 * throw some errors if url is not valid for this module
 * @param url 
 */
export function validateURL(url: string) {
  if (!url) {
    throw ERROR.URL_IS_INVALID
  }
  const parsed = parse(url)
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw ERROR.PROTOCOL_NOT_SUPPORTED
  }
  if (!parsed.hostname || !parsed.host) {
    throw ERROR.URL_IS_INVALID
  }
}

/**
 * resolve filename according to url
 * if destination is not provide then use process dir
 * @param url 
 * @param dest 
 */
export function getDestinationFromURL(url: string, dest?: string) {
  if (!url) {
    throw ERROR.URL_IS_INVALID
  }
  const parsed = parse(url)
  let filename = basename(parsed.hostname)
  if (parsed.pathname !== '/') {
    filename = basename(parsed.pathname)
  }
  if (!dest) {
    // if destination is not defined 
    // then defined as current dir
    return `${process.cwd()}/${filename}`
  }
  return `${dest}/${filename}`
}