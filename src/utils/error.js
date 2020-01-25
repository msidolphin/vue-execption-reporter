import config from '../config'

export const createError = (msg) => {
    if (config.debug) console.error(`VueExceptionReporter: ${msg}`)
    throw new Error(`VueExceptionReporter: ${msg}`)
}