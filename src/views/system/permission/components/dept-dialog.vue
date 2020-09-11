import request from '@/utils/request';
<template>
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :title="alertTitle"
    :visible.sync="visible"
    :before-close="dismiss"
    top="25vh"
    center
    size="mini"
    @open="handleDialogOpen"
    @close="handleDialogClosed"
  >
    <div>
      <el-form ref="deptForm" :model="deptForm" :rules="deptFormRule">
        <el-form-item label="部门名称" label-width="80px" prop="departmentName">
          <el-input v-model="deptForm.departmentName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="上级部门" label-width="80px" prop="parentDepartmentName" style="width: 100%;">
          <el-popover placement="bottom-start" width="500">
            <el-tree
              node-key="id"
              :expand-on-click-node="false"
              :data="deptTree.data"
              :props="deptTree.props"
              @node-click="handleSelectDeptNodeClick"
            />
            <el-input
              slot="reference"
              v-model="deptForm.parentDepartmentName"
              placeholder="请选择上级部门"
              readonly
            />
          </el-popover>
        </el-form-item>
        <el-form-item label="排序" label-width="80px">
          <el-input-number
            v-model="deptForm.orderNum"
            controls-position="right"
            :min="0"
            style="width: 100%;"
          />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-row type="flex" justify="end">
        <el-button size="mini" @click="dismiss">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="isSaveLoading"
          @click="handleSave"
        >保存</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'SysDeptDialog',
  props: {
    mode: { // 0为新增。1为编辑
      type: Number,
      default: 0,
      validator: function(value) {
        return value === 0 || value === 1
      }
    },
    deptTree: {
      type: Object,
      required: true
    },
    userIds: { // 需要获取的用户ID，编辑模式需要传入
      type: Array,
      default: function() {
        return []
      }
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isSaveLoading: false,
      deptForm: {
        orderNum: 0,
        departmentName: '',
        parentDepartmentId: -1,
        parentDepartmentName: ''
      },
      deptFormRule: {
        departmentName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    alertTitle() {
      return this.mode === 0 ? '新增' : '编辑'
    }
  },
  methods: {
    handleDialogOpen() {

    },
    handleDialogClosed() {
      this.deptForm = {
        orderNum: 0,
        departmentName: '',
        parentDepartmentId: -1,
        parentDepartmentName: ''
      }
      // if (this.$refs.userForm) {
      //   this.$refs.userForm.this.$refs.roleForm.clearValidate()
      // }
    },
    handleSave() {
      this.$refs.deptForm.validate(async(valid) => {
        if (valid) {
          try {
            this.isSaveLoading = true
            const data = { ...this.deptForm }
            delete data.parentDepartmentName
            await this.$service.sys.dept.add(data)
            this.isSaveLoading = false
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.success({ ...this.transferForm })
          } catch (e) {
            this.isSaveLoading = false
            this.$message({
              message: '保存失败',
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
    handleSelectDeptNodeClick(node) {
      this.deptForm.parentDepartmentId = node.id
      this.deptForm.parentDepartmentName = node.label
    },
    dismiss() {
      // 父组件用于设置dialog隐藏dialog
      this.$emit('dismiss')
    },
    success(data) {
      this.$emit('success', data)
    },
    fail() {
      this.$emit('fail')
    }
  }
}
</script>

<style></style>
