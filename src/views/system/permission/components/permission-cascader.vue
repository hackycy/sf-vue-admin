<template>
  <el-cascader
    :value="value"
    :options="options"
    :props="props"
    style="width: 100%;"
    separator=":"
    clearable
    @change="handleChange"
  />
</template>

<script>
import PermissionMixin from '../../mixin/permission'

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
  created() {
    const options = []
    this.flatPerms().forEach(arr => {
      this.filterPermToCascader(0, arr, options)
    })
    this.options = options
  },
  methods: {
    /**
     * using v-model
     */
    handleChange(v) {
      this.$emit('input', v)
    }
  }
}
</script>

<style></style>
