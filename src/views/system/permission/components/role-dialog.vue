<template>
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :title="alertTitle"
    :visible.sync="visible"
    :before-close="dismiss"
    center
    size="mini"
    @open="handleDialogOpen"
    @closed="handleDialogClosed"
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
        <el-button size="mini" @click="dismiss">取消</el-button>
        <el-button type="primary" size="mini" :loading="isSaveLoading" @click="handleSaveRole">保存</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import { filterMenuHasPermsToTree, filterDeptToTree } from '@/utils/permission'

export default {
  name: 'SysRoleDialog',
  props: {
    mode: { // 0为新增。1为编辑
      type: Number,
      default: 0,
      validator: function(value) {
        return value === 0 || value === 1
      }
    },
    menuId: {
      type: Number,
      default: -1
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isSaveLoading: false,
      isDialogLoading: false,
      isMenuTreeLoading: false,
      isDeptTreeLoading: false,
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
    alertTitle() {
      return this.mode === 0 ? '新增' : '编辑'
    }
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
    getMenuTreeCheckedKeys() {
      const childKeys = this.$refs.menuTree.getCheckedKeys()
      const halfKeys = this.$refs.menuTree.getHalfCheckedKeys()
      return [...childKeys, ...halfKeys]
    },
    getDeptTreeCheckedKeys() {
      return this.$refs.deptTree.getCheckedKeys()
    },
    handleDialogOpen() {
      if (this.$refs.roleForm) {
        // this.$refs.menuForm.resetField()
        this.$refs.roleForm.clearValidate()
      }
      if (this.mode === 0) {
        this.menuList()
        this.deptList()
      }
      if (this.mode === 1 && this.menuId !== -1) {
        this.isDialogLoading = true
        Promise.all([this.menuList(), this.deptList()])
          .then(async() => {
            // 获取用户信息
            const { data } = await this.$service.sys.role.info({ roleId: this.menuId })
            const { roleInfo, menus, depts } = data
            this.roleForm.name = roleInfo.name
            this.roleForm.label = roleInfo.label
            this.roleForm.remark = roleInfo.remark
            this.roleForm.roleId = roleInfo.id
            // 更新组件
            if (menus && menus.length > 0) {
              menus.forEach(m => {
                // this.$refs.menuTree.setChecked(m.menuId, true, false)
                const node = this.$refs.menuTree.getNode(m.menuId)
                // console.log(node)
                if (node.isLeaf) {
                  this.$refs.menuTree.setChecked(node, true)
                }
              })
              // const menuIds = menus.map(m => {
              //   return m.menuId
              // })
              // this.$refs.menuTree.setCheckedKeys(menuIds)
            }
            if (depts && depts.length > 0) {
              depts.forEach(d => {
                // this.$refs.deptTree.setChecked(d.departmentId, true, false)
                const node = this.$refs.deptTree.getNode(d.departmentId)
                if (node.isLeaf) {
                  this.$refs.deptTree.setChecked(node, true)
                }
              })
              // const deptIds = depts.map(d => {
              //   return d.departmentId
              // })
              // this.$refs.deptTree.setCheckedKeys(deptIds)
            }
            this.isDialogLoading = false
          })
          .catch(() => {
            this.isDialogLoading = false
            this.$message({
              message: '获取信息失败',
              type: 'warning'
            })
            this.dismiss()
          })
      }
    },
    handleDialogClosed() {
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
      if (this.$refs.menuTree && this.$refs.deptTree) {
        this.$refs.menuTree.setCheckedKeys([])
        this.$refs.deptTree.setCheckedKeys([])
      }
      this.isSaveLoading = false
      this.isDialogLoading = false
      this.isMenuTreeLoading = false
      this.isDeptTreeLoading = false
    },
    handleSaveRole() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          this.roleForm.depts = this.getDeptTreeCheckedKeys()
          this.roleForm.menus = this.getMenuTreeCheckedKeys()
          this.isSaveLoading = true
          try {
            if (this.mode === 1) {
              await this.$service.sys.role.update({ ...this.roleForm })
            } else if (this.mode === 0) {
              await this.$service.sys.role.add({ ...this.roleForm })
            }
            this.isSaveLoading = false
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.success()
            this.dismiss()
          } catch (e) {
            this.isSaveLoading = false
            this.fail()
            this.dismiss()
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
    dismiss() {
      // 父组件用于设置dialog隐藏dialog
      this.$emit('dismiss')
    },
    success() {
      this.$emit('success')
    },
    fail() {
      this.$emit('fail')
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-container {
  height: 300px;
  padding-top: 5px;
  overflow: auto;
  border-radius: 6px;
  border: 1px solid #dcdfe6;
}
</style>
