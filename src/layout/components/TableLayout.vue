<template>
  <el-card class="table-layout-container">
    <div v-if="$slots.header" class="header">
      <slot name="header" />
    </div>
    <div class="content">
      <slot />
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'TableLayout'
}
</script>

<style lang="scss" scoped>
.table-layout-container {
  display: flex;
  display: -webkit-flex;
  background-color: #fff;
  flex-direction: column;

  .header {
    margin-bottom: 15px;
  }
}
</style>
