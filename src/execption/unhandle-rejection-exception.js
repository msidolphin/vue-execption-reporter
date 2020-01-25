import { Exception } from './exception'
import { getType } from '../utils/util'
import config from '../config'

export class UnhandleRejectionException extends Exception {

    constructor (e) {
        super(getType(e.reason) === 'Error' ? e.reason : {}, 'unhandledrejection', config.typeDefine.UNHANDLE_REJECTION_EXCEPTION)
        if (getType(e.reason) !== 'Error') {
            this.meta = {
                reason: e.reason
            }
        }
    }

}
