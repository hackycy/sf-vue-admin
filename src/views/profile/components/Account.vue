<template>
  <el-form ref="userForm" v-loading="isLoading" :model="userForm" :rules="userFormRule">
    <h2>个人资料修改</h2>
    <el-form-item label="姓名" prop="name">
      <el-input v-model.trim="userForm.name" />
    </el-form-item>
    <el-form-item label="昵称">
      <el-input v-model.trim="userForm.nickName" />
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model.trim="userForm.email" />
    </el-form-item>
    <el-form-item label="手机号">
      <el-input v-model.trim="userForm.phone" />
    </el-form-item>
    <el-form-item label="旧密码">
      <el-input v-model.trim="userForm.originPassword" />
    </el-form-item>
    <el-form-item label="新密码">
      <el-input v-model.trim="userForm.newPassword" />
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="userForm.remark" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button size="small" type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { person, updatePerson } from '@/api/comm'
import { aesEncrypt } from '@/utils/crypto'

export default {
  data() {
    return {
      isLoading: false,
      userForm: {
        name: '',
        email: '',
        nickName: '',
        phone: '',
        originPassword: '',
        newPassword: '',
        remark: ''
      },
      userFormRule: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getPerson()
  },
  methods: {
    async getPerson() {
      this.isLoading = true
      const { data } = await person()
      this.userForm = data
      this.isLoading = false
    },
    async submit() {
      this.$refs.userForm.validate(async valid => {
        if (valid) {
          try {
            const postData = { ...this.userForm }
            if (this.userForm.originPassword && this.userForm.newPassword) {
              if (this.userForm.originPassword === this.userForm.newPassword) {
                this.$message({
                  message: '新密码与旧密码一致！',
                  type: 'warning'
                })
                return false
              }
              // 加密密码
              postData.originPassword = aesEncrypt(this.userForm.originPassword)
              postData.newPassword = aesEncrypt(this.userForm.newPassword)
            }
            this.isLoading = true
            await updatePerson(postData)
            this.isLoading = false
            this.$message({
              message: '资料更新成功',
              type: 'success',
              duration: 5 * 1000
            })
          } catch (e) {
            this.isLoading = false
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
