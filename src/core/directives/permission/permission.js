import { isString, isArray, isBoolean } from 'lodash'
import { checkPermission } from '@/core/permission/check-permission'

function checkPermissionEl(el, binding) {
  const { value } = binding
  let hasPermission = false
  if (isString(value)) {
    hasPermission = checkPermission(value)
  } else if (isArray(value)) {
    hasPermission = value.some(checkPermission)
  } else if (isBoolean(value)) {
    hasPermission = value
  }

  // hasn't will remove el
  if (!hasPermission) {
    el.parentNode && el.parentNode.removeChild(el)
  }
}

export default {
  // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
  inserted(el, binding) {
    checkPermissionEl(el, binding)
  },
  // 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，
  // 也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
  update(el, binding) {
    checkPermissionEl(el, binding)
  }
}
