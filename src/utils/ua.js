import UAParser from 'ua-parser-js'

let uaParser = null

/* istanbul ignore next */
if (typeof window !== 'undefined') {
    uaParser = new UAParser().getResult()
}

/* istanbul ignore next */
export default () => {
    /* istanbul ignore next */
    if (!uaParser) return {}
    /* istanbul ignore next */
    let ua = uaParser.ua
    /* istanbul ignore next */
    let browser = uaParser.browser ? uaParser.browser : {}
    /* istanbul ignore next */
    let os = uaParser.os  ? uaParser.os : {}
    /* istanbul ignore next */
    let device = uaParser.device && uaParser.device.vendor ? {
            name: uaParser.device.model,
            type: uaParser.device.type,
            vendor: uaParser.device.vendor
    } : {}
    /* istanbul ignore next */
    let engine = uaParser.engine ? uaParser.engine : {}
    /* istanbul ignore next */
    let browserName = browser.name
    /* istanbul ignore next */
    let browserVersion = browser.version
    /* istanbul ignore next */
    let osName = os.name
    /* istanbul ignore next */
    let osVersion = os.version
    /* istanbul ignore next */
    let deviceName = device.name ? device.name : ''
    /* istanbul ignore next */
    let deviceVendor = device.vendor ? device.vendor : ''
    /* istanbul ignore next */
    let deviceType = device.type ? device.type: ''
    /* istanbul ignore next */
    let engineName = engine.name
    /* istanbul ignore next */
    let engineVersion = engine.version
    /* istanbul ignore next */
    return {
        url: window.location.href,
        browserName,
        browserVersion,
        osName,
        osVersion,
        ua,
        deviceName,
        deviceVendor,
        deviceType,
        engineName,
        engineVersion
    }
}
