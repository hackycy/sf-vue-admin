import { isFunction, isObject, cloneDeep, isString } from 'lodash'

export function renderVNode(vnode, { h, scope, $scopedSlots, prop }) {
  if (!vnode) {
    return null
  }
  // 插槽
  if (isString(vnode) && vnode.name.startsWith('slot-')) {
    // template
    const s = $scopedSlots[vnode.name]
    if (s) {
      return s({ scope })
    } else {
      throw new Error(`can not find this slot：${vnode.name}`)
    }
  }

  // render函数
  if (isFunction(vnode)) {
    return vnode({ h, scope })
  }

  // createElement 参数对象
  if (isObject(vnode)) {
    if (vnode.context) {
      return vnode
    }

    if (vnode.name) {
      // https://cn.vuejs.org/v2/guide/render-function.html#深入数据对象
      const keys = [
        'class',
        'style',
        'props',
        'attrs',
        'domProps',
        'on',
        'nativeOn',
        'directives',
        'scopedSlots',
        'slot',
        'key',
        'ref',
        'refInFor'
      ]

      const data = cloneDeep(vnode)

      for (const key in data) {
        if (!keys.includes(key)) {
          delete data[key]
        }
      }
      return h(vnode.name, data)
    } else {
      throw new Error('component name can not be empty')
    }
  }
}
