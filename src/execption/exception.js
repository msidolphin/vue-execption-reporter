import uuid from 'uuid/v4'
import uuidv5 from 'uuid/v5'
import getUaInfo from '../utils/ua'
import StackTrace from 'stacktrace-js'

const idPrefix = 'VueExceptionReporterUID'

let uid = null

if (typeof window !== 'undefined' && window.localStorage.getItem(idPrefix)) {
    uid = window.localStorage.getItem(idPrefix)
} else if (typeof window !== 'undefined') {
    uid = uuid().replace(/-/g, '')
    window.localStorage.setItem(idPrefix, uid)
}

function convert (stack) {
    stack.forEach(s => {
        s.column = s.columnNumber
        s.func = s.functionName
        s.line = s.lineNumber
        s.source = s.source
        s.file = s.fileName
        delete s.fileName
        delete s.columnNumber
        delete s.functionName
        delete s.lineNumber
    })
}

export class Exception {
    constructor (e, title, type) {
        let timestamp = new Date().getTime()
        this.timestamp = timestamp
        /* istanbul ignore next */
        if (!uid) {
            uid = uuid()
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(idPrefix, uid)
            }
        }
        this.uid = uid
        this.id = uuidv5(Math.random().toString(), uid).replace(/-/g, '')
        Object.assign(this, getUaInfo())
        this.type = type
        this.message = title
        const init = (async () => {
            try {
                let stack = await StackTrace.fromError(e)
                if (stack) {
                    this.jsExceptionName = e.name
                    convert(stack)
                    this.stack = stack
                }
            } catch (e) {
            }
            delete this.then
            return this
        })()
        this.then = init.then.bind(init)
    }
}

export default Exception
