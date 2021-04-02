<template>
  <el-card class="table-layout-container">
    <div v-if="$slots.header" class="table-layout-header">
      <slot name="header" />
    </div>
    <div class="table-layout-content">
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

  .table-layout-header {
    margin-bottom: 15px;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;

    .space {
      margin-right: 15px;
    }

  }
}
</style>
