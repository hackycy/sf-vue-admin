import request from '@/utils/request';
<template>
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    title="部门转移"
    :visible.sync="visible"
    :before-close="dismiss"
    center
    size="mini"
    @open="handleDialogOpen"
    @closed="handleDialogClosed"
  >
    <div>
      <el-form ref="transferForm" :model="transferForm" :rules="transferFormRule">
        <el-form-item label="所属部门" label-width="80px" prop="departmentName" style="width: 100%;">
          <el-popover placement="bottom-start" width="500">
            <el-tree
              :expand-on-click-node="false"
              node-key="id"
              :data="deptTree.data"
              :props="deptTree.props"
              @node-click="handleSelectDeptNodeClick"
            />
            <el-input
              slot="reference"
              v-model="transferForm.departmentName"
              placeholder="请选择所属部门"
              readonly
            />
          </el-popover>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-row type="flex" justify="end">
        <el-button size="mini" @click="dismiss">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="isTransferLoading"
          @click="handleTransferUser"
        >转移</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import { filterDeptToTree } from '@/utils/permission'

export default {
  name: 'SysDeptTransferDialog',
  props: {
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
      isTransferLoading: false,
      // 部门
      deptTree: {
        data: [],
        props: {
          children: 'children',
          label: 'label'
        }
      },
      transferForm: {
        departmentName: '',
        departmentId: -1
      },
      transferFormRule: {
        departmentName: [
          { required: true, message: '请选择转移的部门', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async deptList() {
      const { data } = await this.$service.sys.dept.list()
      if (data) {
        this.deptTree.data = filterDeptToTree(data, null)
      }
    },
    handleDialogOpen() {
      this.deptList()
    },
    handleDialogClosed() {
      this.transferForm = {
        departmentName: '',
        departmentId: -1
      }
      if (this.$refs.transferForm) {
        this.$refs.transferForm.clearValidate()
      }
    },
    handleSelectDeptNodeClick(node) {
      this.transferForm.departmentId = node.id
      this.transferForm.departmentName = node.label
    },
    handleTransferUser() {
      this.$refs.transferForm.validate(async(valid) => {
        if (valid) {
          try {
            this.isTransferLoading = true
            await this.$service.sys.dept.transfer({ userIds: this.userIds, departmentId: this.transferForm.departmentId })
            this.isTransferLoading = false
            this.$message({
              message: '转移成功',
              type: 'success'
            })
            this.success({ ...this.transferForm })
          } catch (e) {
            this.isTransferLoading = false
            this.$message({
              message: '转移失败',
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
