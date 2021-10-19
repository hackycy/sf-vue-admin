<template>
  <el-cascader
    :value="permsArr"
    :options="options"
    :props="props"
    style="width: 100%;"
    separator=":"
    clearable
    @change="handleChange"
  />
</template>

<script>
import PermissionMixin from '@/core/mixins/permission'

export default {
  name: 'PermissionCascader',
  mixins: [PermissionMixin],
  // eslint-disable-next-line vue/require-prop-types
  props: ['value'],
  data() {
    return {
      props: { multiple: true },
      options: []
    }
  },
  computed: {
    permsArr: function() {
      // 处理权限 'sys:menu:add,sys:menu:info' => [[ 'sys', 'menu', 'add' ], [...]]
      const arr = this.splitPerms(this.value).map(e => {
        return e.split(':')
      })
      return arr
    }
  },
  created() {
    const options = []
    this.flatPerms(this.$api).forEach(item => {
      // sys:dept:add 需要转换成数组 [ sys, dept, add ]
      const arr = item.split(':')
      this.filterPermToCascader(0, arr, options)
    })
    this.options = options
  },
  methods: {
    /**
     * using v-model
     */
    handleChange(arr) {
      // 处理格式转为string
      const s = this.joinPerms(arr)
      this.$emit('input', s)
    }
  }
}
</script>

<style></style>
