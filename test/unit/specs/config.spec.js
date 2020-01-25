import VueExceptionReporter from '../../../src'
import { tryCatch } from './utils'
import { getReportUrl } from '../../../src/config'
import { getType } from '../../../src/utils/util'

describe(`reportUrl test`, () => {

    it(`reportUrl is not blank string value`, () => {
        const url = 'http://localhost:7001/api/v1/exception/collect'
        VueExceptionReporter.install(null, {
            reportUrl: url
        })
        expect(getReportUrl()).toBe(url)
    })

    it(`reportUrl is blank string value`, () => {
        VueExceptionReporter.install(null, {
            reportUrl: ''
        })
        tryCatch(getReportUrl, 'VueExceptionReporter: reportUrl must not be blank.')
        VueExceptionReporter.install(null, {
            reportUrl: '  '
        })
        tryCatch(getReportUrl, 'VueExceptionReporter: reportUrl must not be blank.')
    })

    it(`reportUrl is not a String or Function`, () => {
        const url = 123
        VueExceptionReporter.install(null, {
            reportUrl: url
        })
        tryCatch(getReportUrl, `VueExceptionReporter: reportUrl option expected String or Functin, but got ${getType(url)}.`)
    })

    it(`reportUrl is a Function, but return type is not a string`, () => {
        const url = 123
        const reportUrl = () => {
            return url
        }
        VueExceptionReporter.install(null, {
            reportUrl
        })
        tryCatch(getReportUrl, `VueExceptionReporter: reportUrl function should return a not blank string value. but got ${url}.`)
    })

    it(`reportUrl is a Function, but return string value is blank`, () => {
        const url = '   '
        const reportUrl = () => {
            return url
        }
        VueExceptionReporter.install(null, {
            reportUrl
        })
        tryCatch(getReportUrl, `VueExceptionReporter: reportUrl function should return a not blank string value. but got ${url}.`)
    })

    it(`reportUrl is a Function and return type is valid string value`, () => {
        const url = 'http://localhost:7001/api/v1/exception/collect'
        const reportUrl = () => {
            return url
        }
        VueExceptionReporter.install(null, {
            reportUrl
        })
        expect(getReportUrl()).toBe(url)
    })

})

describe(`enable test`, () => {

    it(`enable is false`, () => {
        const fn = jest.fn()
        VueExceptionReporter.install(null, {
            enable: false,
            installed: fn
        })
        expect(fn).not.toBeCalled()
    })

    it(`enable is true`, () => {
        const fn = jest.fn()
        VueExceptionReporter.install(null, {
            enable: true,
            installed: fn
        })
        expect(fn).toBeCalled()
    })

})

describe(`debug test`, () => {

    it(`debug is false`, () => {
        const fn = jest.fn()
        const oldConoleError = console.error
        console.error = (msg) => {
            fn()
            oldConoleError(msg)
        }
        VueExceptionReporter.install(null, {
            reportUrl: '',
            enable: true,
            debug: false
        })
        try {
            getReportUrl()
        } catch (e) {}
        expect(fn).not.toBeCalled()
    })

    it(`debug is true`, () => {
        const fn = jest.fn()
        const oldConoleError = console.error
        console.error = (msg) => {
            fn()
            oldConoleError(msg)
        }
        VueExceptionReporter.install(null, {
            reportUrl: '',
            enable: true,
            debug: true
        })
        try {
            getReportUrl()
        } catch (e) {}
        expect(fn).toBeCalled()
    })

})
