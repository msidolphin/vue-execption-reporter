import {
    ScriptRuntimeException,
    RequestFailedException,
    ResourceLoadFailedException,
    UnhandleRejectionException
} from './execption'

import overrideXMLHttpRequest from './core/xhr'
import send from './core/send'
import { shouldReporting, scanRepeatTimes, clearRepeatScanner } from './core/repeat-cache'
import config, { mergeConfig, getReportUrl } from './config'
import { isFunction, isNotUndefined, isNotNull } from './utils/util'

function report (reportUrl, error) {
    if (isFunction(config.send)) {
        config.send(report, error)
    } else {
        send(reportUrl, error)
    }
}

const install = (Vue, options = {}) => {

    mergeConfig(options)

    let reportUnchangeException = config.reportUnchangeException

    let reportRequestException = config.reportRequestException

    let reportUnhandleRejection = config.reportUnhandleRejection

    let reportFailedToLoadResourceException = config.reportFailedToLoadResourceException

    if (!config.enable) return

    /* istanbul ignore next */
    if (reportRequestException && typeof window !== 'undefined') {
        overrideXMLHttpRequest((e, data) => {
            setTimeout(() => {
                if (!shouldReporting(e, config.typeDefine.REQUEST_FAILED_EXCEPTION, data)) return
                ;(async () => {
                    const error = await new RequestFailedException(e, data)
                    if (isFunction(config.beforeReport)) config.beforeReport(error, config.typeDefine.REQUEST_FAILED_EXCEPTION, e)
                    if (error) report(getReportUrl(), error)
                })()
            }, 0)
        })
    }

    /* istanbul ignore next */
    if (reportFailedToLoadResourceException && typeof window !== 'undefined') {
        window.addEventListener('error', function(e) {
            if (e.srcElement != window) {
                if (!shouldReporting(e, config.typeDefine.REQUEST_FAILED_EXCEPTION)) return
                this.setTimeout(() => {
                    ;(async () => {
                        const error = await new ResourceLoadFailedException(e)
                        if (isFunction(config.beforeReport)) config.beforeReport(error, config.typeDefine.REQUEST_FAILED_EXCEPTION, e)
                        if (error) report(getReportUrl(), error)
                    })()
                }, 0)
            }
        }, true)
    }
    
    /* istanbul ignore next */
    if (reportUnchangeException && typeof window !== 'undefined') {
        window.onerror = function(msg, url, line, col, error) {
            this.setTimeout(() => {
                if (!shouldReporting(error, config.typeDefine.SCRIPT_RUNTIME_EXCEPTION)) return
                ;(async () => {
                    const e = await new ScriptRuntimeException(error, null, 'initialize')
                    if (isFunction(config.beforeReport)) config.beforeReport(error, config.typeDefine.SCRIPT_RUNTIME_EXCEPTION, {
                        error,
                        msg,
                        url,
                        line,
                        col
                    })
                    if (error) report(options.reportUrl, e)
                })()
            }, 0)
        }
        if (isNotUndefined(Vue) && isNotNull(Vue) && Vue.config) {
            Vue.config.errorHandler = (err, vm, info) => {
                setTimeout(() => {
                    if (!shouldReporting(err, config.typeDefine.SCRIPT_RUNTIME_EXCEPTION)) return
                    ;(async () => {
                        let { column, line } = err
                        const error = await new ScriptRuntimeException(err, vm, info)
                        if (column !== undefined && line !== undefined && error.stack.length) {
                            error.stack[0].column = column
                            error.stack[0].line = line
                        }
                        if (isFunction(config.beforeReport)) config.beforeReport(error, config.typeDefine.SCRIPT_RUNTIME_EXCEPTION, {
                            error: err,
                            vm,
                            info
                        })
                        if (error) report(getReportUrl(), error)
                    })()
                }, 0)
            }
        }
    }

    /* istanbul ignore next */
    if (reportUnhandleRejection && typeof window !== 'undefined') {
        window.addEventListener('unhandledrejection', function (event) {
            this.setTimeout(() => {
                if (!shouldReporting(event, config.typeDefine.UNHANDLE_REJECTION_EXCEPTION)) return
                ;(async () => {
                    const error = await new UnhandleRejectionException(event)
                    if (isFunction(config.beforeReport)) config.beforeReport(error, config.typeDefine.UNHANDLE_REJECTION_EXCEPTION, event)
                    if (error) report(getReportUrl(), error)
                })()
            }, 0)
            event.preventDefault()
        })
    }

    scanRepeatTimes()

    isFunction(config.installed) && config.installed()

}

export default {
    install,
    clearRepeatScanner
}

export {
    clearRepeatScanner
}
