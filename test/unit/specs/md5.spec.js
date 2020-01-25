import { md5 } from '../../../src/utils/md5'
import uuid from 'uuid/v4'

describe(`md5 test`, () => {

    it(`string value`, () => {

        let set = new Set()
        let N = 10000
        let promises = []

        for (let i = 0; i < N; ++i) {
            promises.push(new Promise(resolve => {
                setTimeout(() => {
                    set.add(md5(uuid()))
                    resolve()
                }, 0)
            }))
        }

        Promise.all(promises).then(() => {
            expect(set.size).toBe(N)
        })

    })

})