import { Exception } from './exception'
import config from '../config'

export class ResourceLoadFailedException extends Exception {

    constructor (e) {
        let el = e.srcElement
        super(e, el.src, config.typeDefine.RESOURCE_LOAD_FAILED_EXCEPTION)
        let type = el.localName
        let src = el.src
        let html = el.outerHTML
        this.meta = {
            type,
            src,
            html
        }
    }

}
