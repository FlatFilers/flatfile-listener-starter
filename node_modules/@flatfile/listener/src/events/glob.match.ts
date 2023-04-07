import { Arrayable } from './event.handler'
import wildMatch from 'wildcard-match'

/**
 * Glob style matching of a value
 *
 * @param val
 * @param filter
 */
export function glob(val: any, filter: string | string[]): boolean {
  if (!val || typeof val !== 'string') {
    return false
  }
  return wildMatch(filter || '**', ':')(val)
}

/**
 * Glob style matching of values in an object
 *
 * @param object
 * @param filter
 */
export function objectMatches(
  object: Record<string, any>,
  filter: Record<string, Arrayable<string>>
): boolean {
  let denied = false
  for (const x in filter) {
    const prop: Arrayable<string> = object[x]

    if (!object?.[x]) {
      return false
    }

    if (
      typeof prop === 'string' ||
      (Array.isArray(prop) && typeof prop[0] === 'string')
    ) {
      if (Array.isArray(prop)) {
        denied ||= !prop.some((p) => {
          return glob(p, filter[x])
        })
      } else {
        denied ||= !glob(prop, filter[x])
      }
    }
  }
  return !denied
}
