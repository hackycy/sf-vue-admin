<template>
  <div>
    <div class="wifi-wrapper" @click="handleClick">
      <svg-icon v-if="!isConnecting" :icon-class="statusIcon" />
      <template v-else>
        <div class="wifi-box">
          <div class="center-box">
            <svg-icon class="wifi-1" icon-class="socket-status-connecting1" />
            <svg-icon class="wifi-2" icon-class="socket-status-connecting2" />
            <svg-icon class="wifi-3" icon-class="socket-status-connecting3" />
          </div>
        </div>
      </template>
    </div>
    <el-dialog
      v-el-drag-dialog
      :visible.sync="visible"
      title="本机信息"
      append-to-body
    >
      <el-descriptions
        :column="1"
        :colon="false"
        :label-style="{ width: '250px' }"
        :content-style="{ flex: 1 }"
      >
        <el-descriptions-item label="操作系统">{{
          info.name
        }}</el-descriptions-item>
        <el-descriptions-item label="用户代理">{{
          info.ua
        }}</el-descriptions-item>
      </el-descriptions>
      <el-divider class="socket-status-dialog__divider" />
      <el-descriptions
        title="在线服务网络诊断"
        :column="1"
        :colon="false"
        :label-style="{ width: '250px' }"
        :content-style="{ flex: 1 }"
      >
        <el-descriptions-item
          label="服务器连接情况"
          :content-style="{ color: delayTextColor }"
        >{{ delayStatus }}</el-descriptions-item>
        <el-descriptions-item
          label="WebSocket连接情况"
          :content-style="{ color: statusTextColor }"
        >{{ statusText }}</el-descriptions-item>
      </el-descriptions>
      <span slot="footer">
        <el-button
          type="plain"
          size="mini"
          @click="checkDelay"
        >重新诊断</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { detectOS } from '@/utils'
import { SocketStatus } from '@/core/socket/socket-io'

export default {
  name: 'SocketStatus',
  props: {
    status: {
      type: String,
      required: false,
      default: SocketStatus.CLOSE
    }
  },
  data() {
    return {
      visible: false,
      info: Object.freeze({
        name: detectOS(navigator.userAgent),
        ua: navigator.userAgent
      }),
      // 延迟检测
      delay: 0,
      startCheckTime: 0,
      imageObj: null,
      online: true,
      intervalID: null
    }
  },
  computed: {
    statusIcon() {
      if (this.status === SocketStatus.CONNECTED) {
        return 'socket-status-connected'
      } else {
        return 'socket-status-close'
      }
    },
    isConnecting() {
      return this.status === SocketStatus.CONNECTING
    },
    statusText() {
      if (this.status === SocketStatus.CONNECTED) {
        return '正常'
      } else if (this.status === SocketStatus.CONNECTING) {
        return '连接中...'
      } else {
        return '已断开'
      }
    },
    statusTextColor() {
      if (this.status === SocketStatus.CONNECTED) {
        return '#50af33'
      } else if (this.status === SocketStatus.CONNECTING) {
        return 'orange'
      } else {
        return 'red'
      }
    },
    delayTextColor() {
      if (this.online) {
        return '#50af33'
      }
      return 'red'
    },
    delayStatus() {
      if (this.online) {
        return `正常 (${this.delay}ms)`
      }
      return `已断开`
    },
    imageUrl() {
      // 错误图片的链接，使得走onerror回调
      return `${location.protocol}//${location.host}/delay-start-${this.startCheckTime}`
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.intervalID = setInterval(this.checkDelay, 2000)
        return
      }
      if (this.intervalID) {
        clearInterval(this.intervalID)
      }
    }
  },
  created() {
    window.addEventListener('online', this.onOnlineEvent)
    window.addEventListener('offline', this.onOfflineEvent)
  },
  destroyed() {
    window.removeEventListener('online', this.onOnlineEvent)
    window.removeEventListener('offline', this.onOfflineEvent)
  },
  methods: {
    handleClick() {
      this.visible = true
      // check delay
      this.$nextTick(() => {
        // 打开时自动检测
        this.checkDelay()
      })
    },
    checkDelay() {
      if (!this.imageObj) {
        this.imageObj = new Image()
        this.imageObj.onerror = () => {
          const loadEndTime = new Date().getTime()
          this.delay = loadEndTime - this.startCheckTime
          this.imageObj = null
        }
      }
      // 发起请求
      this.startCheckTime = new Date().getTime()
      this.imageObj.src = this.imageUrl
    },
    // 监听网络连接状态
    onOnlineEvent() {
      this.online = true
    },
    onOfflineEvent() {
      this.online = false
    }
  }
}
</script>

<style lang="scss" scoped>
.wifi-wrapper {
  height: 100%;

  .wifi-box {
    height: 100%;
    width: 18px;
    display: flex;
    align-items: center;
    justify-content: center;

    .center-box {
      position: relative;
      width: 100%;
      height: 18px;

      .wifi-1,
      .wifi-2,
      .wifi-3 {
        top: 0;
        left: 0;
        position: absolute;
        display: block;
      }

      .wifi-3 {
        animation: signal3 1s steps(1) infinite;
      }

      .wifi-2 {
        animation: signal2 1s steps(1) infinite;
      }
    }
  }
}

.socket-status-dialog__divider {
  margin: 0 0 12px 0;
}

@keyframes signal3 {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
}

@keyframes signal2 {
  0% {
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
}
</style>
