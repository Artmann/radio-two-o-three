export function load<T>(key: string): T {
  const json = storage().getItem(key) || '{}'

  return JSON.parse(json) as T
}

export function save(key: string, value: any): void {
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
