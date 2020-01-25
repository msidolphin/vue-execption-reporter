'use strict'

const Controller = require('egg').Controller
 
var sourceMap = require('source-map')

var axios = require('axios')

var sourcesPathMap = {}

function fixPath(filepath) {
  return filepath.replace(/\.[\.\/]+/g, "");
}

function lookupSource(mapFile, line, column) {
  return new Promise((resolve, reject) => {
    axios.get(mapFile).then(async res => {
      let rawSourceMap = res.data
      let sources = rawSourceMap.sources
      sources.map(item => {
        sourcesPathMap[fixPath(item)] = item
      })
      let consumer = await new sourceMap.SourceMapConsumer(JSON.stringify(rawSourceMap))
      let lookup = {
          line: parseInt(line),
          column: parseInt(column)
      }

      let result = consumer.originalPositionFor(lookup)
      let sourceCodeText = consumer.sourceContentFor(result.source)
      let sourceCodes  = sourceCodeText.split('\n')
      result.sourceContent = sourceCodeText
      debugger
      // 获取代码段 截取前2行以及后2行
      let start = result.line - 2 >= 0 ? result.line - 2 : result.line - 1 >= 0 ? result.line - 1 : result.line
      let end = result.line + 2 < sourceCodes.length ? result.line + 2 : result.line + 1 < sourceCodes.length ? result.line + 1 : result.line 
      resolve(result)
    }).catch(e => {
      reject(e)
    })
  })
}

const ServerResponse = {
  success (data) {
    return {
      code: 200,
      success: true,
      msg: 'ok',
      data
    }
  }
}


const exceptions = []

class ExceptionCollectController extends Controller {

  async list () {
    const { ctx } = this
    ctx.headers['Content-Type'] = 'application/json'
    ctx.body = ServerResponse.success(exceptions)
  }

  async collect () {
    const { ctx } = this
    const body = ctx.query
    debugger
    if (body.meta) body.meta = JSON.parse(body.meta)
    if (body.stack) body.stack = JSON.parse(body.stack)
    exceptions.unshift(body)
    ctx.headers['Content-Type'] = 'application/json'
    ctx.body = ServerResponse.success()
  }

  async source () {
    const { ctx } = this
    let { id } = ctx.query
    let index = exceptions.findIndex(e => e.id === id)
    if (index === -1) {
      ctx.body = ServerResponse.success()
    } else {
      let result = {}
      let stack = exceptions[index].stack
      if (stack) {
        for (let i = 0; i < stack.length; ++i) {
          let s = stack[i]
          try {
            let url = s.url.lastIndexOf('?') !== -1 ? s.url.substring(0, s.url.lastIndexOf('?')) : s.url
            if (url.indexOf('vendor') !== -1 || s.info) continue
            let info = await lookupSource(url + '.map', s.line, s.column)
            s.info = info
          } catch (e) {
          }
        }
        result.stack = stack
      }
      let meta = exceptions[index].meta
      result.meta = meta
      ctx.headers['Content-Type'] = 'application/json'
      ctx.body = ServerResponse.success(result)
    }
  }

}

module.exports = ExceptionCollectController
