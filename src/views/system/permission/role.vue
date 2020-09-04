<template>
  <div class="role-container">
    <div class="role-header">
      <el-button size="mini" @click="handleRefresh">刷新</el-button>
      <el-button size="mini" type="primary" @click="handleAdd">新增</el-button>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.role-container {
  padding: 15px;

  .role-header {
    margin-bottom: 15px;
  }

}
</style>
