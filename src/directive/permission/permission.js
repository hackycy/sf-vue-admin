import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const perms = store.getters && store.getters.perms
  let userPerms = []
  let isOrMode = false
  if (Object.prototype.toString.call(value) === '[object String]') {
    userPerms = [value]
  } else if (value && value instanceof Array) {
    userPerms = value.length > 0 ? value : []
  } else if (Object.prototype.toString.call(value) === '[object Object]') {
    if (value.or && value.or instanceof Array) {
      isOrMode = true
      userPerms = value.or
    } else if (value.and && value.or instanceof Array) {
      isOrMode = false
      userPerms = value.and
    } else {
      throw new Error(`need perms! Like v-permission="{ or: [$service.permission.user.add] }"`)
    }
  } else {
    throw new Error(`need perms! Like v-permission="[$service.permission.user.add]"`)
  }
  let hasPermission = false
  if (isOrMode) {
    hasPermission = isOrContain(perms, userPerms)
  } else {
    hasPermission = isAndContain(perms, userPerms)
  }
  if (!hasPermission) {
    el.parentNode && el.parentNode.removeChild(el)
  }
}

function isAndContain(perms, comparePerms) {
  const hasPermission = true
  for (const p of comparePerms) {
    if (!perms.includes(p)) {
      // 如果当前项不存在则直接返回false
      return false
    }
  }
  return hasPermission
}

function isOrContain(perms, comparePerms) {
  const hasPermission = perms.some(role => {
    return comparePerms.includes(role)
  })
  return hasPermission
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
