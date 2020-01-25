import { shouldReporting, scanRepeatTimes, clearRepeatScanner } from '../../../src/core/repeat-cache'
import config from '../../../src/config'

describe('should reporting test', () => {

    it ('script runtime exception', async () => {

        config.ignoreRepeatTimes = 3
        config.scanInterval = 200

        scanRepeatTimes()

        const event = {
            stack: 'error'
        }

        expect(shouldReporting(event, config.typeDefine.SCRIPT_RUNTIME_EXCEPTION)).toBeTruthy()
        expect(shouldReporting(event, config.typeDefine.SCRIPT_RUNTIME_EXCEPTION)).toBeTruthy()
        expect(shouldReporting(event, config.typeDefine.SCRIPT_RUNTIME_EXCEPTION)).toBeTruthy()
        expect(shouldReporting(event, config.typeDefine.SCRIPT_RUNTIME_EXCEPTION)).toBeFalsy()

        await new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, 2 * config.scanInterval)
        })

        expect(shouldReporting(event, config.typeDefine.SCRIPT_RUNTIME_EXCEPTION)).toBeTruthy()
        expect(shouldReporting(event, config.typeDefine.SCRIPT_RUNTIME_EXCEPTION)).toBeTruthy()
        expect(shouldReporting(event, config.typeDefine.SCRIPT_RUNTIME_EXCEPTION)).toBeTruthy()
        expect(shouldReporting(event, config.typeDefine.SCRIPT_RUNTIME_EXCEPTION)).toBeFalsy()

        clearRepeatScanner()
    })

    it(`request failed exception`, () => {
        config.ignoreRepeatTimes = 3
        config.scanInterval = 2000

        scanRepeatTimes()

        const event1 = {
            status: 404,
            requestMethod: 'GET',
            requestUrl: '/api/v1/404'
        }

        const event2 = {
            status: 404,
            requestMethod: 'POST',
            requestUrl: '/api/v1/404'
        }

        expect(shouldReporting(event1, config.typeDefine.REQUEST_FAILED_EXCEPTION)).toBeTruthy()
        expect(shouldReporting(event1, config.typeDefine.REQUEST_FAILED_EXCEPTION)).toBeTruthy()
        expect(shouldReporting(event1, config.typeDefine.REQUEST_FAILED_EXCEPTION)).toBeTruthy()
        expect(shouldReporting(event1, config.typeDefine.REQUEST_FAILED_EXCEPTION)).toBeFalsy()
        expect(shouldReporting(event2, config.typeDefine.REQUEST_FAILED_EXCEPTION, {a: 1})).toBeTruthy()
        expect(shouldReporting(event2, config.typeDefine.REQUEST_FAILED_EXCEPTION, {a: 1})).toBeTruthy()
        expect(shouldReporting(event2, config.typeDefine.REQUEST_FAILED_EXCEPTION, {a: 1})).toBeTruthy()
        expect(shouldReporting(event2, config.typeDefine.REQUEST_FAILED_EXCEPTION, {a: 1})).toBeFalsy()

        clearRepeatScanner()

    })

    it(`failed to load resource exception`, () => {
        config.ignoreRepeatTimes = 3
        config.scanInterval = 2000

        scanRepeatTimes()

        const event = {
            srcElement: {
                src: 'https://qinmudi.cn/2.js'
            }
        }

        expect(shouldReporting(event, config.typeDefine.RESOURCE_LOAD_FAILED_EXCEPTION)).toBeTruthy()
        expect(shouldReporting(event, config.typeDefine.RESOURCE_LOAD_FAILED_EXCEPTION)).toBeTruthy()
        expect(shouldReporting(event, config.typeDefine.RESOURCE_LOAD_FAILED_EXCEPTION)).toBeTruthy()
        expect(shouldReporting(event, config.typeDefine.RESOURCE_LOAD_FAILED_EXCEPTION)).toBeFalsy()

        clearRepeatScanner()

    })

    it(`unhandlerejection exception`, () => {
        config.ignoreRepeatTimes = 3
        config.scanInterval = 2000

        scanRepeatTimes()

        const event = {
            reason: new Error('unhandlerejection')
        }

        expect(shouldReporting(event, config.typeDefine.UNHANDLE_REJECTION_EXCEPTION)).toBeTruthy()
        expect(shouldReporting(event, config.typeDefine.UNHANDLE_REJECTION_EXCEPTION)).toBeTruthy()
        expect(shouldReporting(event, config.typeDefine.UNHANDLE_REJECTION_EXCEPTION)).toBeTruthy()
        expect(shouldReporting(event, config.typeDefine.UNHANDLE_REJECTION_EXCEPTION)).toBeFalsy()

        clearRepeatScanner()
    })

    it(`ignoreRepeatTimes is zero`, () => {

        config.ignoreRepeatTimes = 0

        const event = {
            stack: 'error'
        }

        for (let i = 0; i < 100; ++i) {
            expect(shouldReporting(event, config.typeDefine.SCRIPT_RUNTIME_EXCEPTION)).toBeTruthy()
        }
    })
})