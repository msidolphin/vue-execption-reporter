import { Exception } from './exception'
import config from '../config'

export class RequestFailedException extends Exception {

    constructor (e, body) {
        let requestMethod = e.requestMethod
        let requestUrl = e.requestUrl
        let requestBody = body
        let status = e.status
        super(e, `${e.status} ${requestMethod} ${requestUrl}`, config.typeDefine.REQUEST_FAILED_EXCEPTION)
        this.meta = {
            status,
            requestBody,
            requestMethod,
            requestUrl
        }
    }

}