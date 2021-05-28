import mitt from 'mitt'

const install = (Vue) => {
  const emitter = mitt()
  Vue.prototype.$eventBus = emitter
}

export default install
