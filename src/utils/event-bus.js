const install = (Vue) => {
  const Bus = new Vue({
    methods: {
      emit(event, ...args) {
        this.$emit(event, ...args)
      },
      on(event, cb) {
        this.$on(event, cb)
      },
      off(event, cb) {
        this.$off(event, cb)
      }
    }
  })
  Vue.prototype.$eventBus = Bus
}

export default install
