<template>
  <div>
    <svg-icon :icon-class="statusIcon" />
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
      if (this.status === SocketStatus.CONNECTING) {
        return 'socket-status-connecting'
      } else if (this.status === SocketStatus.CONNECTED) {
        return 'socket-status-connected'
      } else {
        return 'socket-status-close'
      }
    }
  }
}
</script>
