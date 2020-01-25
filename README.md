# vue-exception-reporter

> An exception reporting libarary

# 使用方式
```js
import Vue from 'vue'
import App from './App'
import VueExceptionReporter, { clearRepeatScanner } from 'vue-exception-reporter'

Vue.use(VueExceptionReporter, {
  reportUrl: 'http://localhost:7001/api/v1/exception/collect'
})

new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  beforeDestroy () {
    // clearRepeatScanner()
    // VueExceptionReporter.clearRepeatScanner()
  }
})
```

# 配置选项
```js
{
  reportUrl: '', // 上报地址，类型可以是字符串或函数。如果类型为函数，那么应该返回字符串
  enable: true, // 是否启用
  debug: true, // 是否在控制台打印错误日志
  ignoreRepeatTimes: 5, // 在指定时间内异常重复触发超过该次数时不进行上报
  scanInterval: 3000, // 扫描重复次数间隔
  usingBeacon: false, // 是否采用beacon上报数据，默认采用Image标签
  beforeReport: undefined, // 上报数据前的钩子函数 (data, type, event) => {} 注意：如果异常对象被置为空，则不会进行上报
  afterReport: undefined, // 数据上报后的钩子函数
  send: undefined, // 用户自定义上报函数 (url, data) => {}
  installed: undefined, // 插件成功安装钩子函数
  reportUnchangeException: true, // 是否上报未捕获异常
  reportRequestException: true, // 是否上报ajax请求异常
  reportUnhandleRejection: true, // 是否上报未处理的reject异常（兼容性不好）
  reportFailedToLoadResourceException: true, // 是否上报资源加载失败异常
  typeDefine: { // 类型常量定义，因为上传时的数据类型
    RESOURCE_LOAD_FAILED_EXCEPTION: 'ResourceLoadFailedException', // 资源加载失败异常
    REQUEST_FAILED_EXCEPTION: 'RequestFailedException', // ajax请求异常
    SCRIPT_RUNTIME_EXCEPTION: 'ScriptRuntimeException', // js脚本执行错误异常
    UNHANDLE_REJECTION_EXCEPTION: 'UnhandleRejectionException' // 未处理reject异常
  }
}
```

# 异常对象结构

## 基础结构

| 参数名称   | 说明   | 类型   | 
| :---- |:---- |:---- |
| id   | 上报数据唯一标识   | String   | 
| uid   | 浏览器用户唯一标识   | String   | 
| type   | 异常类型（由配置项中typeDefined定义）| String   | 
| timestamp | 时间戳（异常对象创建时间）| Number  | 
| message | 异常消息  | Number   |
| ua | 用户代理  | String   | 
| url | 异常发生页面  | String   |
| osName | 操作系统  | String   | 
| osVersion | 操作系统版本  | String   | 
| browserName | 浏览器  | String   | 
| browserVersion | 浏览器版本  | String   | 
| engineName | 浏览器渲染引擎  | String   | 
| engineVersion | 浏览器渲染引擎版本  | String   | 
| deviceName | 设备名称  | String   | 
| deviceType | 设备类型  | String   | 
| deviceVendor | 设备供应商  | String   | 
| jsExceptionName | js异常类型 | String   | 
| stack | 异常堆栈 | Array  | 
| meta | 异常明细项  | Object   | 


## 明细项

### js脚本执行错误异常

| 参数名称   | 说明   | 类型  |
|:---- |:---- |:---- |
| type   | 错误类型   | String | 
| element   | 触发元素   | String| 
| elementInnerText   | 触发元素文本 | String| 
| elementClassName | 触发元素类名| String| 


### ajax请求异常

| 参数名称   | 说明   | 类型   | 
|:----|:----|:----|
| status   | 状态码   | Number   | 
| requestUrl   | 请求地址   | String   | 
| requestMethod   | 请求方式 | String   | 
| requestBody | 请求体（json） | String  | 

### 资源加载失败异常

| 参数名称   | 说明   | 类型   | 
|:----|:----|:----|
| type   | 资源类型   | Number   | 
| src    | 资源地址   | String   | 
| html   | html标签 | String   | 


### 未处理reject异常

| 参数名称   | 说明   | 类型   | 
|:----|:----|:----|
| reason   | reject原因 （如果reason为异常类型则会忽略）  | -   | 



# License
[MIT](http://opensource.org/licenses/MIT)

Copyright © 2019, msidolphin
