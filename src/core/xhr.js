export default (onError = () => {}) => {
    
    var ajaxObserver = new Object()
    ajaxObserver.send = XMLHttpRequest.prototype.send
    ajaxObserver.open = XMLHttpRequest.prototype.open

    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        ajaxObserver.open.apply(this, [method, url, async, user, password])
        this.requestUrl = url
        this.requestMethod = method
    }

    XMLHttpRequest.prototype.send = function(_data) {
        var oldReq = this.onreadystatechange
        this.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status >= 200 && this.status < 300) {
                    oldReq ? oldReq.apply(this, [_data]) : ''
                } else {
                    if (typeof onError === 'function') onError(this, _data)
                }
            }
        }
        ajaxObserver.send.apply(this, [_data])
    }

}