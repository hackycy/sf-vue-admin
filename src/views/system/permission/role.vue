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
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="alertTitle"
      :visible.sync="editerDialogVisible"
      center
      size="mini"
      @open="handleDialogOpen"
      @close="handleDialogClosed"
    >
      <div v-loading="isDialogLoading" class="dialog-content">
        <el-form ref="roleForm" :model="roleForm" :rules="roleFormRule">
          <el-row type="flex" justify="space-between">
            <el-col :span="12">
              <el-form-item label="名称" label-width="80px" prop="name">
                <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="标识" label-width="80px" prop="label">
                <el-input v-model="roleForm.label" placeholder="请输入角色标识" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注" label-width="80px">
            <el-input v-model="roleForm.remark" type="textarea" />
          </el-form-item>
          <el-row type="flex" justify="space-between">
            <el-col :span="12">
              <el-form-item label="菜单权限" label-width="80px" prop="menus" border>
                <div v-loading="isMenuTreeLoading" class="tree-container">
                  <el-tree
                    ref="menuTree"
                    :data="menuTree.data"
                    show-checkbox
                    node-key="id"
                    highlight-current
                    :props="menuTree.props"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据权限" label-width="80px" prop="dept">
                <div v-loading="isDeptTreeLoading" class="tree-container">
                  <el-tree
                    ref="deptTree"
                    v-loading="isDeptTreeLoading"
                    :data="deptTree.data"
                    show-checkbox
                    node-key="id"
                    highlight-current
                    :props="deptTree.props"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div slot="footer">
        <el-row type="flex" justify="end">
          <el-button size="mini" @click="editerDialogVisible = false">取消</el-button>
          <el-button type="primary" size="mini" :loading="isSaveLoading" @click="handleSaveRole">保存</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { momentParseTime } from '@/utils'
import { filterMenuHasPermsToTree, filterDeptToTree } from '@/utils/permission'

export default {
  name: 'SysPermissionRole',
  data() {
    return {
      alertDialogMode: 0, // 0为新增，1为编辑
      editerDialogVisible: false,
      isDeleteLoading: false,
      isTableLoading: true,
      isSaveLoading: false,
      isDialogLoading: false,
      isMenuTreeLoading: false,
      isDeptTreeLoading: false,
      currentPage: 1,
      pageSizes: [25, 50, 75, 100],
      pageSize: 25,
      totalRoles: 0,
      role: [],
      multipleSelectionRole: [],
      roleForm: {
        roleId: -1,
        name: '',
        label: '',
        remark: '',
        menus: [],
        depts: []
      },
      roleFormRule: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        label: [{ required: true, message: '请输入角色标识', trigger: 'blur' }]
      },
      menuTree: {
        data: [],
        props: {
          children: 'children',
          label: 'label'
        }
      },
      deptTree: {
        data: [],
        props: {
          children: 'children',
          label: 'label'
        }
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
    async menuList() {
      // 获取菜单
      this.isMenuTreeLoading = true
      const { data } = await this.$service.sys.menu.list()
      if (data) {
        this.menuTree.data = filterMenuHasPermsToTree(data, null)
      }
      this.isMenuTreeLoading = false
    },
    async deptList() {
      this.isDeptTreeLoading = true
      const { data } = await this.$service.sys.dept.list()
      if (data) {
        this.deptTree.data = filterDeptToTree(data, null)
      }
      this.isDeptTreeLoading = false
    },
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
      console.log(childKeys)
      console.log(halfKeys)
      return [...childKeys, ...halfKeys]
    },
    getDeptTreeCheckedKeys() {
      return this.$refs.deptTree.getCheckedKeys()
    },
    refreshRole() {
      this.roleData = []
      this.page()
    },
    handleDialogOpen() {
      this.menuList()
      this.deptList()
    },
    handleDialogClosed() {
      this.resetFormData()
      this.isSaveLoading = false
      this.isDialogLoading = false
      this.isMenuTreeLoading = false
      this.isDeptTreeLoading = false
    },
    handleRefresh() {
      this.isTableLoading = true
      this.refreshRole()
    },
    resetFormData() {
      this.roleForm = {
        roleId: -1,
        name: '',
        label: '',
        remark: '',
        menus: [],
        depts: []
      }
      this.menuTree.data = []
      this.deptTree.data = []
      if (this.$refs.roleForm) {
        // this.$refs.menuForm.resetField()
        this.$refs.roleForm.clearValidate()
        this.$refs.menuTree.setCheckedKeys([])
        this.$refs.deptTree.setCheckedKeys([])
      }
    },
    handleAdd() {
      this.alertDialogMode = 0
      this.editerDialogVisible = true
    },
    async handleEdit(row) {
      this.alertDialogMode = 1
      this.editerDialogVisible = true
      this.isDialogLoading = true
      const { data } = await this.$service.sys.role.info({ roleId: row.id })
      const { roleInfo, menus, depts } = data
      this.roleForm.name = roleInfo.name
      this.roleForm.label = roleInfo.label
      this.roleForm.remark = roleInfo.remark
      this.roleForm.roleId = roleInfo.id
      this.isDialogLoading = false
      // 更新组件
      if (menus && menus.length > 0) {
        menus.forEach(m => {
          this.$refs.menuTree.setChecked(m.menuId, true, false)
        })
        // const menuIds = menus.map(m => {
        //   return m.menuId
        // })
        // this.$refs.menuTree.setCheckedKeys(menuIds, true)
      }
      if (depts && depts.length > 0) {
        depts.forEach(d => {
          this.$refs.deptTree.setChecked(d.departmentId, true, false)
        })
        // const deptIds = depts.map(d => {
        //   return d.departmentId
        // })
        // this.$refs.deptTree.setCheckedKeys(deptIds)
      }
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
    handleSaveRole() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          this.roleForm.depts = this.getDeptTreeCheckedKeys()
          this.roleForm.menus = this.getMenuTreeCheckedKeys()
          this.isSaveLoading = true
          try {
            if (this.alertDialogMode === 1) {
              await this.$service.sys.role.update({ ...this.roleForm })
            } else if (this.alertDialogMode === 0) {
              await this.$service.sys.role.add({ ...this.roleForm })
            }
            this.isSaveLoading = false
            this.handleRefresh()
            this.editerDialogVisible = false
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          } catch (e) {
            this.isSaveLoading = false
          }
        } else {
          this.$message({
            message: '请正确填写内容',
            type: 'warning'
          })
          return false
        }
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

  .tree-container {
    height: 300px;
    padding-top: 5px;
    overflow: auto;
    border-radius: 6px;
    border: 1px solid #dcdfe6;
  }
}
</style>
