import { printANSI } from '@/utils'
import store from '@/store'
import { getToken } from '@/utils/auth'

export default function Initializer() {
  printANSI()

  store.commit('user/SET_TOKEN', getToken())
}
