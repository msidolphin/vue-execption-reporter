import config from '../config'
import { isString } from '../utils/util'
import { md5 } from '../utils/md5'

var cache = {}

var timer = null

export function scanRepeatTimes () {
    if (config.ignoreRepeatTimes <= 0) return
    clearRepeatScanner()
    timer = setInterval(() => {
        cache = {}
    }, config.scanInterval)
}

export function clearRepeatScanner () {
    clearInterval(timer)
    timer = null
}

export const repeatTimesIsExceed = key => {
    return cache[key] && cache[key] > config.ignoreRepeatTimes
}

export const addRepeatTimes = key => {
    if (cache[key]) {
        cache[key] += 1
    } else {
        cache[key] = 1
    }
}

export const generateKey = (e, type, extra) => {
    let key = null
    switch (type) {
        case config.typeDefine.SCRIPT_RUNTIME_EXCEPTION:
        key = e.stack
        break
        case config.typeDefine.REQUEST_FAILED_EXCEPTION:
        key = `${e.status}${e.requestMethod}${e.requestUrl}`
        if (extra && !isString(extra)) key += JSON.stringify(extra)
        break
        case config.typeDefine.RESOURCE_LOAD_FAILED_EXCEPTION:
        key = e.srcElement.src
        break
        case config.typeDefine.UNHANDLE_REJECTION_EXCEPTION:
        key = JSON.stringify(e.reason)
        break
    }
    /* istanbul ignore next */
    return key ? md5(key) : null
}

export const shouldReporting = (e, type, extra) => {
    const key = generateKey(e, type, extra)
    addRepeatTimes(key)
    if (config.ignoreRepeatTimes <= 0 || (key && !repeatTimesIsExceed(key))) {
        return true
    }
    return false
}
