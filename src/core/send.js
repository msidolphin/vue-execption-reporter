import config from '../config'
import { isFunction, isNotString } from '../utils/util'

function encode(data) {
    var arr = []
    for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]))
    }
    return arr.join("&")
}

function sendByImage (reportUrl, data, cb) {
    if (!data) return
    var img = new Image()
    if (data.meta && isNotString(data.meta)) data.meta = JSON.stringify(data.meta)
    if (data.stack && isNotString(data.stack)) data.stack = JSON.stringify(data.stack)
    img.onload = img.onerror = function(e) {
        img = null
        isFunction(config.afterReport) && config.afterReport()
    }
    img.src = `${reportUrl}?${encode(data)}`
}

function sendByBeacon (reportUrl, data) {
    if (!data) return
    if (data.meta && isNotString(data.meta)) data.meta = JSON.stringify(data.meta)
    if (data.stack && isNotString(data.stack)) data.stack = JSON.stringify(data.stack)
    let ret = navigator.sendBeacon(reportUrl, JSON.stringify(data))
    return ret
}

export default (reportUrl, data) => {
     /* istanbul ignore next */
    if (navigator.sendBeacon && config.usingBeacon) {
        if (sendByBeacon(reportUrl, data)) {
            isFunction(config.afterReport) && config.afterReport()
            return
        }
    }
    sendByImage(reportUrl, data)
}
