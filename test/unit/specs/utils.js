export function tryCatch(cb = () => {}, msg = '') {
    try {
        cb()
    } catch (e) {
        expect(e.toString()).toMatch(msg)
    }
}

export function spyFn (cb = () => {}) {
    cb()
}
