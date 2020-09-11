<template>
  <div class="role-container">
    <div class="role-header">
      <el-button size="mini" @click="handleRefresh">刷新</el-button>
      <el-button size="mini" type="primary" @click="handleAdd">新增</el-button>
      <el-button
        size="mini"
        :loading="isDeleteLoading"
        type="danger"
        :disabled="enableMutipleDelete"
        @click="handleMutipleDelete"
      >删除</el-button>
    </div>
    <div class="role-content">
      <el-table
        ref="roleTable"
        v-loading="isTableLoading"
        :data="roleData"
        :loading="true"
        max-height="700px"
        border
        row-key="id"
        size="small"
        style="width: 100%;"
        :header-cell-style="{ backgroundColor: '#ebeef4' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
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
    <div class="role-footer">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="pageSizes"
        layout="total, sizes, prev, pager, next"
        :page-size="pageSize"
        :total="totalRoles"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <role-dialog
      :mode="editerDialogMode"
      :menu-id="editerDialogMenuId"
      :visible="editerDialogVisible"
      @success="handleSaveRoleSuccessEvent"
      @dismiss="editerDialogVisible = false"
    />
  </div>
</template>

<script>
import { momentParseTime } from '@/utils'
import RoleDialog from './components/role-dialog'

export default {
  name: 'SysPermissionRole',
  components: {
    RoleDialog
  },
  data() {
    return {
      editerDialogMode: 0, // 0为新增，1为编辑
      editerDialogVisible: false,
      editerDialogMenuId: -1,
      isDeleteLoading: false,
      isTableLoading: true,
      currentPage: 1,
      pageSizes: [25, 50, 75, 100],
      pageSize: 25,
      totalRoles: 0,
      role: [],
      multipleSelectionRole: []
    }
  },
  computed: {
    enableMutipleDelete() {
      return !(this.multipleSelectionRole && this.multipleSelectionRole.length > 0)
    },
    alertTitle() {
      return this.alertDialogMode === 0 ? '新增' : '编辑'
    }
  },
  created() {
    this.handleRefresh()
  },
  methods: {
    async page() {
      const { data } = await this.$service.sys.role.page({ page: this.currentPage, limit: this.pageSize })
      const { roles, roleTotalCount } = data
      this.totalRoles = roleTotalCount
      this.isTableLoading = false
      if (roles && roleTotalCount) {
        this.roleData = roles.map(e => {
          e.createTime = momentParseTime(e.createTime)
          e.updateTime = momentParseTime(e.updateTime)
          return e
        })
      }
    },
    async delete(roleIds) {
      this.isDeleteLoading = true
      try {
        await this.$service.sys.role.delete({ roleIds })
        this.handleRefresh()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      } catch (e) {
        this.$message({
          type: 'warning',
          message: '删除角色失败'
        })
      }
      this.isDeleteLoading = false
    },
    getMenuTreeCheckedKeys() {
      const childKeys = this.$refs.menuTree.getCheckedKeys()
      const halfKeys = this.$refs.menuTree.getHalfCheckedKeys()
      return [...childKeys, ...halfKeys]
    },
    getDeptTreeCheckedKeys() {
      return this.$refs.deptTree.getCheckedKeys()
    },
    refreshRole() {
      this.roleData = []
      this.page()
    },
    handleRefresh() {
      // this.currentPage = 1
      this.isTableLoading = true
      this.refreshRole()
    },
    handleAdd() {
      this.editerDialogMode = 0
      this.editerDialogVisible = true
    },
    handleEdit(row) {
      this.editerDialogMode = 1
      this.editerDialogMenuId = row.id
      this.editerDialogVisible = true
    },
    async handleMutipleDelete() {
      // 处理多选删除
      this.$confirm('此操作将永久删除且无法还原, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.multipleSelectionRole && this.multipleSelectionRole.length > 0) {
          const roleIds = this.multipleSelectionRole.map(e => { return e.id })
          this.delete(roleIds)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    async handleDelete(row) {
      // 处理单选删除
      this.$confirm('此操作将永久删除且无法还原, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (row && row.id) {
          this.delete([row.id])
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    handleSaveRoleSuccessEvent() {
      this.handleRefresh()
    },
    handleSelectionChange(val) {
      this.multipleSelectionRole = val
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.handleRefresh()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.handleRefresh()
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
  .role-footer {
    margin-top: 20px;
    text-align: end;
  }

  .tree-container {
    height: 300px;
    padding-top: 5px;
    overflow: auto;
    border-radius: 6px;
    border: 1px solid #dcdfe6;
  }
}
</style>
