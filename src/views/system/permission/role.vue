<template>
  <div class="role-container">
    <div class="role-header">
      <el-button size="mini" @click="handleRefresh">刷新</el-button>
      <el-button size="mini" type="primary" @click="handleAdd">新增</el-button>
      <el-button size="mini" type="danger" :disabled="enableMutipleDelete" @click="handleMutipleDelete">删除</el-button>
    </div>
    <div class="role-content">
      <el-table
        ref="roleTable"
        v-loading="isLoading"
        :data="roleData"
        border
        row-key="id"
        size="small"
        style="width: 100%;"
        :header-cell-style="{ backgroundColor: '#ebeef4' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        />
        <el-table-column prop="name" label="名称" align="center" />
        <el-table-column prop="label" label="标识" align="center" />
        <el-table-column prop="remark" label="备注" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column prop="updateTime" label="更新时间" align="center" />
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { momentParseTime } from '@/utils'

export default {
  name: 'SysPermissionRole',
  data() {
    return {
      isLoading: true,
      role: [],
      multipleSelectionRole: []
    }
  },
  computed: {
    enableMutipleDelete() {
      return !(this.multipleSelectionRole && this.multipleSelectionRole.length > 0)
    }
  },
  created() {
    this.handleRefresh()
  },
  methods: {
    async list() {
      const { data } = await this.$service.sys.role.list()
      this.isLoading = false
      if (data) {
        this.roleData = data.map(e => {
          e.createTime = momentParseTime(e.createTime)
          e.updateTime = momentParseTime(e.updateTime)
          return e
        })
      }
    },
    refreshMenu() {
      this.roleData = []
      this.list()
    },
    handleRefresh() {
      this.isLoading = true
      this.refreshMenu()
    },
    handleAdd() {
      //
    },
    handleMutipleDelete() {
      // 处理多选删除
    },
    handleEdit(row) {

    },
    handleDelete(row) {
      //
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelectionRole = val
    }
  }
}
</script>

<style lang="scss" scoped>
.role-container {
  padding: 15px;

  .role-header {
    margin-bottom: 15px;
  }
  // .role-content {
  //   max-height: 300px;
  //   overflow: auto;
  // }
}
</style>
