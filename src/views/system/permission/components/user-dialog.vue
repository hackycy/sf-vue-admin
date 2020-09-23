<template>
  <el-dialog
    v-el-drag-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :title="userAlertTitle"
    :visible.sync="visible"
    :before-close="dismiss"
    center
    top="10vh"
    size="mini"
    @open="handleDialogOpen"
    @closed="handleDialogClosed"
  >
    <div v-loading="isUserDialogLoading">
      <el-form ref="userForm" :model="userForm" :rules="userFormRule">
        <el-form-item label="所属部门" label-width="80px" prop="departmentName" style="width: 100%;">
          <el-popover placement="bottom-start" width="500">
            <el-tree
              :expand-on-click-node="false"
              node-key="id"
              :data="deptTree.data"
              :props="deptTree.props"
              @node-click="handleSelectUserDeptNodeClick"
            />
            <el-input
              slot="reference"
              v-model="userForm.departmentName"
              placeholder="请选择所属部门"
              readonly
            />
          </el-popover>
        </el-form-item>
        <el-form-item label="所属角色" label-width="80px" prop="roles" style="width: 100%;">
          <el-select
            v-model="userForm.roles"
            multiple
            placeholder="请选择"
            style="width: 100%;"
            :multiple-limit="3"
          >
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="账号" label-width="80px" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入账号" />
        </el-form-item>
        <el-row type="flex" justify="space-between">
          <el-col :span="12">
            <el-form-item label="姓名" label-width="80px" prop="name">
              <el-input v-model="userForm.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="呢称" label-width="80px">
              <el-input v-model="userForm.nickName" placeholder="请输入昵称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="space-between">
          <el-col :span="12">
            <el-form-item label="邮箱" label-width="80px">
              <el-input v-model="userForm.email" placeholder="请输入邮箱，用于获取初始密码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机" label-width="80px">
              <el-input v-model="userForm.phone" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" label-width="80px">
          <el-input v-model="userForm.remark" type="textarea" />
        </el-form-item>
        <el-form-item label="状态类型" label-width="80px">
          <el-radio-group v-model="userForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="mode === 1" label="重置密码" label-width="80px">
          <el-switch v-model="userForm.resetPassword" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-row type="flex" justify="end">
        <el-button size="mini" @click="dismiss">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="isUserSaveLoading"
          @click="handleSaveUser"
        >保存</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog'
import { filterDeptToTree } from '@/utils/permission'

export default {
  name: 'SysUserDialog',
  directives: { elDragDialog },
  props: {
    mode: {
      // 新增模式 0 或 编辑模式 1
      type: Number,
      default: 0,
      validator: function(value) {
        return value === 0 || value === 1
      }
    },
    userId: {
      // 需要获取的用户ID，编辑模式需要传入
      type: Number,
      default: -1
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    const validateRoles = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error('请选择所属角色'))
      } else {
        callback()
      }
    }
    return {
      isUserDialogLoading: false,
      isUserSaveLoading: false,
      // 部门
      deptTree: {
        data: [],
        props: {
          children: 'children',
          label: 'label'
        }
      },
      roles: [],
      userForm: {
        departmentName: '',
        departmentId: -1,
        username: '',
        name: '',
        nickName: '',
        remark: '',
        email: '',
        phone: '',
        status: 1,
        roles: [],
        resetPassword: false
      },
      userFormRule: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        departmentName: [
          { required: true, message: '请选择所属部门', trigger: 'blur' }
        ],
        roles: [{ required: true, trigger: 'blur', validator: validateRoles }]
      }
    }
  },
  computed: {
    userAlertTitle() {
      return this.mode === 0 ? '新增' : '编辑'
    }
  },
  methods: {
    async roleList() {
      const { data } = await this.$service.sys.role.list()
      if (data) {
        this.roles = data
      }
    },
    async deptList() {
      this.isDeptTreeLoading = true
      const { data } = await this.$service.sys.dept.list()
      if (data) {
        this.deptTree.data = filterDeptToTree(data, null)
      }
      this.isDeptTreeLoading = false
    },
    handleUploadAvatarSuccess(res) {
      const { url } = res.data
      if (url) {
        this.userForm.headImg = url
      }
    },
    handleSelectUserDeptNodeClick(node) {
      this.userForm.departmentId = node.id
      this.userForm.departmentName = node.label
    },
    handleDialogOpen() {
      if (this.$refs.userForm) {
        this.$refs.userForm.clearValidate()
      }
      if (this.mode === 0) {
        this.roleList()
        this.deptList()
      }
      if (this.mode === 1) {
        this.isUserDialogLoading = true
        Promise.all([this.roleList(), this.deptList()])
          .then(async() => {
            // 获取用户信息
            const result = await this.$service.sys.user.info({
              userId: this.userId
            })
            const { data } = result
            this.userForm = { ...data }
            this.isUserDialogLoading = false
          })
          .catch(() => {
            this.isUserDialogLoading = false
            this.$message({
              message: '获取信息失败',
              type: 'warning'
            })
            this.dismiss()
          })
      }
    },
    handleDialogClosed() {
      this.userForm = {
        headImg: '',
        departmentName: '',
        departmentId: -1,
        username: '',
        name: '',
        nickName: '',
        remark: '',
        email: '',
        phone: '',
        status: 1,
        roles: [],
        resetPassword: false
      }
      if (this.$refs.uploader) {
        this.$refs.uploader.clearFiles()
      }
    },
    handleSaveUser() {
      this.$refs.userForm.validate(async(valid) => {
        if (valid) {
          try {
            this.isUserSaveLoading = true
            const postData = { ...this.userForm }
            delete postData.departmentName
            if (this.mode === 0) {
              await this.$service.sys.user.add(postData)
            } else {
              await this.$service.sys.user.update({ id: this.userId, ...postData })
            }
            this.isUserSaveLoading = false
            this.$message({
              message: '添加成功',
              type: 'success'
            })
            this.success()
          } catch (e) {
            this.isUserSaveLoading = false
            this.$message({
              message: '添加失败',
              type: 'warning'
            })
            this.fail()
          }
          this.dismiss()
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

<style></style>
