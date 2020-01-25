import { Exception } from './exception'
import config from '../config'

export class ScriptRuntimeException extends Exception {

    constructor (err, vm, info) {
        let type = err.name
        super(err, err.message, config.typeDefine.SCRIPT_RUNTIME_EXCEPTION)
        /* istanbul ignore next */
        let element = vm && vm.$el ? {
            tag: vm.$el.tagName,
            text: vm.$el.textContent,
            className: vm.$el.className
        } : {}
        this.meta = {
            type,
            element: element.tag,
            elementInnerText: element.text,
            elementClassName: element.className
        }
    }

}