<template>
  <div>
    <el-button type="primary" @click="onClick">javascript runtime execption</el-button>
    <el-button type="primary" @click="onRequestError">request exception</el-button>
    <el-button type="primary" @click="onScriptLoadFailed">failed to load resource</el-button>
    <el-button type="primary" @click="onUnhandleRejection">unhandle rejection</el-button>
    <ol class="exception-list">
      <li v-for="(exception, index) in exceptions" class="exception-list-item" :key="index" :class="{active: exception.show}">
        <div class="exception-list-item-summary">
          <div class="exception-list-item-summary-lt">
            <div class="el-icon-arrow-right trigger" @click="getExceptionDetail(exception)"></div>
            <div class="exception-list-item-summary-lt__mark"></div>
            <div
              class="exception-list-item-summary-lt__message"
            >{{exception.jsExceptionName ? exception.jsExceptionName + '：' + exception.message : exception.message}}</div>
          </div>
          <div class="exception-list-item-summary-rt">
            <div>{{ exception.timestamp | date }}</div>
          </div>
        </div>
        <div class="exception-list-item-detail" v-if="exception.show">
          <h3>{{exception.url}}</h3>
          <h5>uid: {{exception.uid}}</h5>
          <table class="ua" style="width:600px">
            <caption style="text-align:left;">{{exception.ua}}</caption>
            <tbody>
              <tr>
                <th>Os</th>
                <td colspan="3">{{exception.osName}}</td>
                <th>Os version</th>
                <td colspan="3">{{exception.osVersion}}</td>
              </tr>
              <tr>
                <th>Browser</th>
                <td colspan="3">{{exception.browserName}}</td>
                <th>Browser version</th>
                <td colspan="3">{{exception.browserVersion}}</td>
              </tr>
              <tr>
                <th>Engine</th>
                <td colspan="3">{{exception.engineName}}</td>
                <th>Engine version</th>
                <td colspan="3">{{exception.engineVersion}}</td>
              </tr>
              <tr v-if="exception.deviceName">
                <th>Device</th>
                <td colspan="3">{{exception.deviceName}}</td>
                <th>Device type</th>
                <td colspan="3">{{exception.deviceType}}</td>
              </tr>
            </tbody>
          </table>
          <div
            v-if="exception.type === 'ScriptRuntimeException' || exception.type === 'UnhandleRejectionException'"
            class="exception-list-item-detail-stack-reason"
          >{{exception.jsExceptionName + '：' + exception.message}}</div>
          <ol class="exception-list-item-detail-stack" v-if="exception.stack">
            <li
              v-for="(item, idx) in exception.stack"
              class="exception-list-item-detail-stack-item"
              :key="idx"
            >
              <div
                class="exception-list-item-detail-stack-item__path"
                v-if="item.info"
              >at {{item.func}} {{item.info.source}}:{{item.info.line}}</div>
              <div
                class="exception-list-item-detail-stack-item__path"
                v-else
              >at {{item.func}} {{item.file}}({{item.line}}:{{item.column}})</div>
              <!-- <highlight v-if="item.info && item.info.sourceContent" lang='javascript'><template v-slot>{{item.info.sourceContent}}</template></highlight> -->
            </li>
          </ol>
          <div class="resource-info" v-if="exception.type === 'ResourceLoadFailedException'">
            <div class="resource-info__title">Resource Information</div>
            <table>
              <tbody>
                <tr>
                  <th>tag</th>
                  <td colspan="3">{{exception.meta.type}}</td>
                </tr>
                <tr>
                  <th>html</th>
                  <td colspan="3">{{exception.meta.html}}</td>
                </tr>
                <tr>
                  <th>src</th>
                  <td colspan="3">{{exception.meta.src}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="request-info" v-if="exception.type === 'RequestFailedException'">
            <div class="request-info__title">Request Information</div>
            <table>
              <tbody>
                <tr>
                  <th>url</th>
                  <td colspan="3">{{exception.meta.requestUrl}}</td>
                </tr>
                <tr>
                  <th>method</th>
                  <td colspan="3">{{exception.meta.requestMethod}}</td>
                </tr>
                <tr>
                  <th>body</th>
                  <td colspan="3">{{exception.meta.requestBody}}</td>
                </tr>
                <tr>
                  <th>status</th>
                  <td colspan="3">{{exception.meta.status}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>

<script>
import Vue from "vue";
import bus from './bus'
export default {
  filters: {
    date(val) {
      let date = new Date(Number(val));
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }
  },
  data() {
    return {
      exceptions: []
    };
  },
  methods: {
    onError(e) {
      const a = null;
      "foo".push(a)
      // a.name = "foo";
    },
    onClick() {
      this.onError();
    },
    onInput() {
      let a = undefined;
      a.name = "11";
    },
    onRequestError() {
      this.$api("app/404", {
        a: 1
      })
        .then(res => {
          console.log(res);
        })
        .catch(e => {
          console.log(e);
        });
    },
    onScriptLoadFailed() {
      let script = document.createElement("script");
      script.src = "https://qinmudi.cn/2.js";
      document.body.append(script);
    },
    onUnhandleRejection() {
      new Promise((resolve, reject) => {
        reject(new Error("unhandledrejection"));
      });
    },
    getExceptions() {
      this.$api("app/exceptions")
        .then(res => {
          this.exceptions = res;
        })
        .catch(e => {
          console.error(e);
        });
    },
    getExceptionDetail(e) {
      if (typeof e.show !== "undefined") {
        e.show = !e.show;
        return;
      }
      this.$api("app/exceptionDetail", {
        id: e.id
      })
        .then(res => {
          if (res.stack) e.stack = res.stack;
          this.$set(e, "show", true);
        })
        .catch(e => {
          console.error(e);
        });
    }
  },
  created() {
    bus.$on('on-reported', () => {
      this.getExceptions();
    });
    this.getExceptions();
  }
};
</script>

<style lang="less" scoped>
.exception-list {
  list-style: none;
  padding-left: 0;
  &-item {
    &-summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      padding: 6px 10px;
      &-lt {
        display: flex;
        align-items: center;
        .trigger {
          display: block;
          cursor: pointer;
          font-size: 16px;
          &:hover {
            color: #409bff;
          }
        }
        &__mark {
          display: inline-block;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #e67482;
          margin: 0 10px;
        }
        &__message {
          color: #333;
          font-size: 16px;
        }
      }
      &-rt {
        color: #606060;
      }
    }
    &.active {
      .trigger {
        transform: rotate(90deg);
      }
    }
    &-detail {
      background: #e8e8e8;
      padding: 10px 0 10px 30px;
      .ua {
        margin-bottom: 10px;
      }
      &-stack-reason {
        margin-bottom: 0px;
      }
      ol {
        list-style: none;
        padding: 0 10px 0px;
        padding-left: 30px;
      }
    }
  }
}
</style>