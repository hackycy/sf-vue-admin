import ServiceRegister from './decorator/service'
import Vue from 'vue'

/**
 * global init
 */
export default function Initializer() {
  // server register
  ServiceRegister(Vue)
}
