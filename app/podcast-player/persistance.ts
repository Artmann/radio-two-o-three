import { isNumber, isObject } from 'lodash'

export function load<T>(key: string): T {
  const json = storage().getItem(key) || '{}'

  return JSON.parse(json) as T
}

export function save(key: string, value: any): void {
  // We want to avoid overwriting the storage
  // with a non-object value.

  if (isObject(value) && Object.keys(value).length === 0) {
    return
  }

  if(isNumber(value) && value === 0) {
    return
  }

  const json = JSON.stringify(value)

  storage().setItem(key, json)
}

interface Storage {
  getItem(key: string): string | null
  setItem(key: string, value: any): void
}

function storage(): Storage {
  if (typeof window !== 'undefined') {
    return window.localStorage
  }

  return {
    getItem: () => null,
    setItem: () => {},
  }
}
