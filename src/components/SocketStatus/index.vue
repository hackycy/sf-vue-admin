<template>
  <div>
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
</template>

<script>
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
    }
  }
}
</script>

<style lang="scss" scoped>
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
