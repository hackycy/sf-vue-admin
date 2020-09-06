<template>
  <div class="role-container">
    <div class="role-header">
      <el-button size="mini" @click="handleRefresh">刷新</el-button>
      <el-button size="mini" type="primary" @click="handleAdd">新增</el-button>
      <el-button size="mini" :loading="isDeleteLoading" type="danger" :disabled="enableMutipleDelete" @click="handleMutipleDelete">删除</el-button>
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
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="alertTitle"
      :visible.sync="editerDialogVisible"
      center
      size="mini"
      @close="handleDialogClosed"
    >
      <el-form
        ref="roleForm"
        :model="roleForm"
      >
        <el-form-item label="节点名称" label-width="80px" prop="name">
          <el-input v-model="roleForm.type" placeholder="请输入节点名称" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-row type="flex" justify="end">
          <el-button size="mini" @click="editerDialogVisible = false">取消</el-button>
          <el-button type="primary" size="mini" :loading="isSaveLoading" @click="handleSaveMenu">保存</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { momentParseTime } from '@/utils'

export default {
  name: 'SysPermissionRole',
  data() {
    return {
      alertDialogMode: 0, // 0为新增，1为编辑
      editerDialogVisible: false,
      isDeleteLoading: false,
      isTableLoading: true,
      currentPage: 1,
      pageSizes: [25, 50, 75, 100],
      pageSize: 25,
      totalRoles: 0,
      role: [],
      multipleSelectionRole: [],
      roleForm: {
        type: 0
      }
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
    refreshMenu() {
      this.roleData = []
      this.page()
    },
    handleRefresh() {
      this.isTableLoading = true
      this.refreshMenu()
    },
    handleAdd() {
      this.alertDialogMode = 0
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
    handleEdit(row) {

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
}
</style>
