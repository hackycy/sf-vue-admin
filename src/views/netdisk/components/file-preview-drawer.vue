<template>
  <el-drawer
    :size="500"
    title="文件详情"
    :visible="visible"
    direction="rtl"
    :before-close="handleClose"
  >
    <div class="preview-drawer-inner-box">
      a
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'FilePreviewDrawer',
  data() {
    return {
      visible: false
    }
  },
  methods: {
    open() {
      this.visible = true
    },
    handleClose() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-drawer-inner-box {
  padding: 0 20px;
}
</style>
