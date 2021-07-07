import { mapGetters } from 'vuex'

export const SOCKET_HOOK_KEY = 'socketHook'

/**
 * 当包含自定义 socketHook 选项时，会进行自动注册socket事件，自动销毁
 */
export default {
  computed: {
    ...mapGetters(['socketClient'])
  },
  watch: {
    socketClient() {
      // client instance实例发生变化时重新注册
      this.$registerSocketEvent()
    }
  },
  mounted() {
    this.$registerSocketEvent()
  },
  beforeDestroy() {
    this.$unregisterSocketEvent()
  },
  methods: {
    '$registerSocketEvent'() {
      if (this.$options[SOCKET_HOOK_KEY]) {
        Object.keys(this.$options[SOCKET_HOOK_KEY]).forEach(e => {
          if (this.socketClient) {
            this.socketClient.subscribe(e, this.$options[SOCKET_HOOK_KEY][e])
          }
        })
      }
    },
    '$unregisterSocketEvent'() {
      if (this.$options[SOCKET_HOOK_KEY]) {
        Object.keys(this.$options[SOCKET_HOOK_KEY]).forEach(e => {
          if (this.socketClient) {
            this.socketClient.unsubscribe(e, this.$options[SOCKET_HOOK_KEY][e])
          }
        })
      }
    }
  }
}
