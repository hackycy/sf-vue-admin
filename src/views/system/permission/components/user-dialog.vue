<template>
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :title="userAlertTitle"
    :visible.sync="visible"
    :before-close="cancel"
    center
    size="mini"
    @open="handleUserDialogOpen"
    @close="handleUserDialogClosed"
  >
    <div v-loading="isUserDialogLoading">
      <el-form ref="userForm" :model="userForm" :rules="userFormRule">
        <el-form-item label="头像" label-width="80px" prop="headImg">
          <el-upload
            action="/admin/upload/img"
            list-type="picture-card"
            :headers="getUploadheader()"
            :before-upload="beforeAvatarUpload"
            with-credentials
            :limit="1"
            :on-success="handleUploadAvatarSuccess"
          >
            <i class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item label="所属部门" label-width="80px" prop="departmentName" style="width: 100%;">
          <el-popover placement="bottom-start" width="500">
            <el-tree
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
      </el-form>
    </div>
    <div slot="footer">
      <el-row type="flex" justify="end">
        <el-button size="mini" @click="cancel">取消</el-button>
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
import { getToken } from '@/utils/auth'
import { filterDeptToTree } from '@/utils/permission'

export default {
  name: 'SysUserDialog',
  props: {
    mode: {
      // 新增模式 0 或 编辑模式 1
      type: Number,
      default: 0,
      validator: function(value) {
        return value === 0 || value === 1
      }
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
      editerUserDialogVisible: false,
      editerUserDialogMode: 0,
      isUserSaveLoading: false,
      // 部门
      deptTree: {
        data: [],
        props: {
          children: 'children',
          label: 'label'
        }
      },
      currentDepartmentId: -1,
      multipleSelectionUserList: [],
      roles: [],
      userForm: {
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
        roles: []
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
    cancel() {
      // 父组件用于设置dialog隐藏dialog
      this.$emit('cancel')
    },
    getUploadheader() {
      return {
        Authorization: getToken()
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
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
    handleUserDialogOpen() {
      this.roleList()
      this.deptList()
    },
    handleUserDialogClosed() {
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
        roles: []
      }
      if (this.$refs.userForm) {
        this.$refs.userForm.this.$refs.roleForm.clearValidate()
      }
    },
    handleSaveUser() {
      this.$refs.userForm.validate(async(valid) => {
        if (valid) {
          try {
            this.isUserSaveLoading = true
            await this.$service.sys.user.add(this.userForm)
            this.isUserSaveLoading = false
            this.editerUserDialogVisible = false
            this.handleRefreshUser()
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          } catch (e) {
            this.isUserSaveLoading = false
            this.$message({
              message: '添加失败',
              type: 'warning'
            })
          }
        } else {
          this.$message({
            message: '请正确填写内容',
            type: 'warning'
          })
          return false
        }
      })
    }
  }
}
</script>

<style></style>
