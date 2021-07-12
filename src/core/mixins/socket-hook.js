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
        // mounted map, cache wrapper func
        if (!this.$socket) {
          this.$socket = new Map()
        }
        Object.keys(this.$options[SOCKET_HOOK_KEY]).forEach(e => {
          if (this.socketClient) {
            // bind this
            const wrapFunc = this.$options[SOCKET_HOOK_KEY][e].bind(this)
            this.$socket.set(e, wrapFunc)
            this.socketClient.subscribe(e, wrapFunc)
          }
        })
      }
    },
    '$unregisterSocketEvent'() {
      if (this.$options[SOCKET_HOOK_KEY]) {
        Object.keys(this.$options[SOCKET_HOOK_KEY]).forEach(e => {
          // 增加判断避免被移除掉所有事件
          if (this.socketClient && this.$socket && this.$socket.has(e)) {
            this.socketClient.unsubscribe(e, this.$socket.get(e))
          }
        })
      }
    }
  }
}
