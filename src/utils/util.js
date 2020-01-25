/* istanbul ignore next */
export const isString = function (target) {
    return Object.prototype.toString.call(target) === '[object String]'
}

/* istanbul ignore next */
export const isNotString = function (target) {
    return !isString(target)
}

/* istanbul ignore next */
export const isBlank = function (target) {
    return isString(target) && !target.trim()
}

/* istanbul ignore next */
export const isNotBlank = function (target) {
    return !isBlank(target)
}

/* istanbul ignore next */
export const getType = function (target) {
    return Object.prototype.toString.call(target).replace(/\]/g, '').split(' ')[1]
}

export const isNull = function (val) {
    /* istanbul ignore next */
    return val === null
}

export const isNotNull = function (val) {
    /* istanbul ignore next */
    return !isNull(val)
}

export const isUndefined = function (val) {
    /* istanbul ignore next */
    return typeof val === 'undefined'
}

export const isNotUndefined = function (val) {
    /* istanbul ignore next */
    return !isUndefined(val)
}

export const isEmpty = function (val) {
    /* istanbul ignore next */
    if (isString(val)) {
        return val.trim() === ''
    }
    /* istanbul ignore next */
    return isNull(val) || isUndefined(val)
}

export const isPlainObject = function (obj) {
    /* istanbul ignore next */
    return Object.prototype.toString.call(obj) === '[object Object]' && Object.getPrototypeOf(obj) === Object.prototype
}

export const isFunction = function (fn) {
    return Object.prototype.toString.call(fn) === '[object Function]'
}

export const isArray = Array.isArray || /* istanbul ignore next */ function (ary) {
    return Object.prototype.toString.call(ary) === '[object Array]'
}
  
export function extend() {
    let options
    let name
    let src
    let copy
    let copyIsArray
    let clone
    /* istanbul ignore next */
    let target = arguments[0] || {}
    let i = 1
    let length = arguments.length
    let force = false
  
    // 如果第一个参数为布尔,判定是否深拷贝
    /* istanbul ignore next */
    if (typeof target === 'boolean') {
      force = target
      target = arguments[1] || {}
      i++
    }
  
    // 确保接受方为一个复杂的数据类型
    /* istanbul ignore next */
    if (typeof target !== 'object' && !isFunction(target)) {
      target = {}
    }
  
    // 如果只有一个参数，那么新成员添加于 extend 所在的对象上
    /* istanbul ignore next */
    if (i === length) {
      target = this
      i--
    }
  
    for (; i < length; i++) {
      // 只处理非空参数
      /* istanbul ignore next */
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name]
          copy = options[name]
  
          // 防止环引用
          if (target === copy) {
            continue
          }
          /* istanbul ignore next */
          if (force && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false
              clone = src && isArray(src) ? src : []
            } else {
              clone = src && isPlainObject(src) ? src : {}
            }
            target[name] = extend(force, clone, copy)
          } else if (copy !== undefined) {
            target[name] = copy
          }
        }
      }
    }
    return target
}