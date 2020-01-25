import { extend, isFunction, isNotBlank, getType, isString, isNotString, isBlank } from '../utils/util'
import { createError } from '../utils/error'

const typeDefine = {
    RESOURCE_LOAD_FAILED_EXCEPTION: 'ResourceLoadFailedException',
    REQUEST_FAILED_EXCEPTION: 'RequestFailedException',
    SCRIPT_RUNTIME_EXCEPTION: 'ScriptRuntimeException',
    UNHANDLE_REJECTION_EXCEPTION: 'UnhandleRejectionException'
}

var config = {
    reportUrl: '',
    enable: true,
    debug: true,
    ignoreRepeatTimes: 5,
    scanInterval: 3000,
    usingBeacon: true,
    beforeReport: undefined,
    afterReport: undefined,
    send: undefined,
    installed: undefined,
    reportUnchangeException: true,
    reportRequestException: true,
    reportUnhandleRejection: true,
    reportFailedToLoadResourceException: true,
    typeDefine: JSON.parse(JSON.stringify((typeDefine)))
}

export const mergeConfig = (options) => {
    extend(config, options)
    if (options.typeDefine) config.typeDefine = extend(typeDefine, options.typeDefine)
}

export const getReportUrl = () => {
    if (isString(config.reportUrl)) {
        if (isNotBlank(config.reportUrl)) return config.reportUrl
        else {
            createError(`reportUrl must not be blank.`)
        }
    }
    if (isFunction(config.reportUrl)) {
        let url = config.reportUrl()
        if (isNotString(url) || isBlank(url)) {
            createError(`reportUrl function should return a not blank string value. but got ${url}.`)
        } else {
            return url
        }
    }
    createError(`reportUrl option expected String or Functin, but got ${getType(config.reportUrl)}.`)
}

export default config
