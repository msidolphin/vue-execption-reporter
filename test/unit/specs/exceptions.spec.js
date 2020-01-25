import {
    RequestFailedException,
    ResourceLoadFailedException,
    ScriptRuntimeException,
    UnhandleRejectionException
} from '../../../src/execption'

function judgeScriptError (error, type) {
    basicJudge(error)
    expect(error.jsExceptionName).toBe(type)
    expect(error.stack).not.toBeUndefined()
    expect(error.stack).not.toBeNull()
    expect(error.stack.length).toBeGreaterThanOrEqual(1)
}

function basicJudge (error) {
    expect(error).not.toBeUndefined()
    expect(error).not.toBeNull()
    expect(error.uid).not.toBeUndefined()
    expect(error.uid).not.toBeNull()
    expect(error.id).not.toBeUndefined()
    expect(error.id).not.toBeNull()
    expect(error.meta).not.toBeUndefined()
    expect(error.meta).not.toBeNull()
}

describe(`script runtime exception test`, () => {

    it(`ReferenceError`, async () => {
        try {
            console.log(a)
        } catch (e) {
            const error = await new ScriptRuntimeException(e)
            judgeScriptError(error, 'ReferenceError')
        }
    })

    it(`TypeError`, async () => {
        try {
            const foo = ''
            foo.push(1)
        } catch (e) {
            const error = await new ScriptRuntimeException(e)
            judgeScriptError(error, 'TypeError')
        }
    })

    it(`RangeError`, async () => {
        try {
            const a = [1, 2, 3]
            a[-1] = 0
        } catch (e) {
            const error = await new ScriptRuntimeException(e)
            judgeScriptError(error, 'RangeError')
        }
    })

    it(`URIError`, async () => {
        try {
            decodeURI('%')
        } catch (e) {
            const error = await new ScriptRuntimeException(e)
            judgeScriptError(error, 'URIError')
        }
    })

})

describe(`failed to load resource exception test`, () => {

    it('noop', async () => {
        const src = 'https://qinmudi.cn/2.js'
        const localName = 'script'
        const outerHTML = `<${localName} src="${src}"></${localName}>`
        const error = await new ResourceLoadFailedException({
            srcElement: {
                src,
                localName,
                outerHTML
            }
        })
        basicJudge(error)
        expect(error.meta.type).not.toBeUndefined()
        expect(error.meta.type).not.toBeNull()
        expect(error.meta.type).toBe(localName)
        expect(error.meta.src).not.toBeUndefined()
        expect(error.meta.src).not.toBeNull()
        expect(error.meta.src).toBe(src)
        expect(error.meta.html).not.toBeUndefined()
        expect(error.meta.html).not.toBeNull()
        expect(error.meta.html).toBe(outerHTML)
    })

})

describe(`request exception test`, () => {

    it(`GET`, async () => {
        const api = '/api/v1/get?id=1'
        const method = 'GET'
        const status = 504
        const error = await new RequestFailedException({
            requestMethod: method,
            requestUrl: api,
            status
        })
        basicJudge(error)
        expect(error.meta.requestMethod).not.toBeUndefined()
        expect(error.meta.requestMethod).not.toBeNull()
        expect(error.meta.requestMethod).toBe(method)
        expect(error.meta.requestUrl).not.toBeUndefined()
        expect(error.meta.requestUrl).not.toBeNull()
        expect(error.meta.requestUrl).toBe(api)
        expect(error.meta.status).not.toBeUndefined()
        expect(error.meta.status).not.toBeNull()
        expect(error.meta.status).toBe(status)
    })

    it(`POST`, async () => {
        const api = '/api/v1/post?type=0'
        const method = 'POST'
        const body = {
            id: 1
        }
        const status = 400
        const error = await new RequestFailedException({
            requestMethod: method,
            requestUrl: api,
            status
        }, body)
        basicJudge(error)
        expect(error.meta.requestMethod).not.toBeUndefined()
        expect(error.meta.requestMethod).not.toBeNull()
        expect(error.meta.requestMethod).toBe(method)
        expect(error.meta.requestUrl).not.toBeUndefined()
        expect(error.meta.requestUrl).not.toBeNull()
        expect(error.meta.requestUrl).toBe(api)
        expect(error.meta.status).not.toBeUndefined()
        expect(error.meta.status).not.toBeNull()
        expect(error.meta.status).toBe(status)
        expect(error.meta.requestBody).not.toBeUndefined()
        expect(error.meta.requestBody).not.toBeNull()
        expect(JSON.stringify(error.meta.requestBody)).toBe(JSON.stringify(body))
    })

})

describe(`unhandlerejection exception test`, () => {

    it(`reason is Error`, async () => {
        const error = await new UnhandleRejectionException({
            reason: new Error('unhandlerejection')
        })
        expect(error).not.toBeUndefined()
        expect(error).not.toBeNull()
        expect(error.uid).not.toBeUndefined()
        expect(error.uid).not.toBeNull()
        expect(error.id).not.toBeUndefined()
        expect(error.id).not.toBeNull()
        expect(error.jsExceptionName).toBe('Error')
        expect(error.stack).not.toBeUndefined()
        expect(error.stack).not.toBeNull()
        expect(error.stack.length).toBeGreaterThanOrEqual(1)
    })

    it(`reason is not Error`, async () => {
        const error = await new UnhandleRejectionException({
            reason: 'unhandlerejection'
        })
        expect(error).not.toBeUndefined()
        expect(error).not.toBeNull()
        expect(error.uid).not.toBeUndefined()
        expect(error.uid).not.toBeNull()
        expect(error.id).not.toBeUndefined()
        expect(error.id).not.toBeNull()
    })

})