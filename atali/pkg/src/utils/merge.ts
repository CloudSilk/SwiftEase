export function deepMerge(...objs: any[]): any {
  const result = Object.create(null)
  objs.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key]
        if (isPlainObject(val)) {
          // 递归
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val)
          } else {
            result[key] = deepMerge(val)
          }
        } else {
          result[key] = val
        }
      })
    }
  })
  return result
}

export function merge(src: any, dst: any) {
  if (!dst) return
  if (src) {
    Object.keys(src).forEach(key => {
      dst[key] = src[key]
    })
  }
}

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}