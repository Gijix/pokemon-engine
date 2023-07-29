interface ValidateOption {
  min: number,
  max: number,
  msg: (value: string) => string
}

export function validate (option: ValidateOption) {
  const check = (item: any) => (item > option.max || item < option.min)

  return function (target: any, propertyKey: string) {
    let baseValue: any
    
    function get () {
      return baseValue
    }

    function set (value: any) {
      if (Array.isArray(value)) {
        target.forEach((item: number) => {
          if (check(item)) {
            throw new Error(option.msg(String(item)))
          }
        })
      }

      if (typeof value === 'object' ) {
        Object.keys(value).forEach(key => {
          Object.defineProperty(value, key, {
            get,
            set
          })
        })
      }

      if (check(value)) {
        throw new Error(option.msg(String(value)))
      }

      baseValue = value
    }

    Object.defineProperty(target, propertyKey, {
      get,
      set
    })
  }
}