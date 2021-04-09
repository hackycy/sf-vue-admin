<template>
  <div class="sys-user-container">
    <table-layout :wrap="false" asside-width="300px">
      <template #asside>
        <sys-dept-tree-pane />
      </template>
      <template #header>
        <div class="user-title">用户管理</div>
        <el-button size="mini">刷新</el-button>
        <el-button size="mini" type="primary">新增</el-button>
      </template>
      <template>a</template>
    </table-layout>
  </div>
</template>

<script>
// import STable from '@/components/Table'
import TableLayout from '@/layout/components/TableLayout'
import SysDeptTreePane from './components/dept-tree-pane'

export default {
  name: 'SystemPermissionUser',
  components: {
    // STable,
    TableLayout,
    SysDeptTreePane
  }
}
</script>

<style lang="scss" scoped>
.sys-user-container {
  height: 100%;
  position: relative;

  .user-title {
    width: 100%;
    text-align: center;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1px;
    margin-bottom: 5px;
  }
}
</style>
