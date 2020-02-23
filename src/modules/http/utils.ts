import { parse } from 'url'
import { basename } from 'path'

import { ERROR } from '@libs/constants'
import { ensureDirectoryExistence } from '@libs/utils'

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
  let filename = basename(parsed.hostname)
  if (parsed.pathname !== '/') {
    filename = basename(parsed.pathname)
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