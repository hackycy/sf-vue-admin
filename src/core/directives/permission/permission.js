import store from '@/store'
import { isString, isArray } from 'lodash'

function checkPermission(el, binding) {
  const { value } = binding
  let hasPermission = false
  if (isString(value)) {
    hasPermission = parse(value)
  } else if (isArray(value)) {
    hasPermission = value.some(parse)
  }

  // hasn't will remove el
  if (!hasPermission) {
    el.parentNode && el.parentNode.removeChild(el)
  }
}

function parse(value) {
  const permissionList = store.getters && store.getters.perms

  return value ? permissionList.some(e => {
    return e === value
  }) : false
}

export default {
  // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  // 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，
  // 也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
  update(el, binding) {
    checkPermission(el, binding)
  }
}
