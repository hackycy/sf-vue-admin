<template>
  <form-dialog ref="formDialog">
    <template #slot-dept-node="{ scope }">
      <el-popover placement="bottom-start" width="500">
        <el-tree
          :style="{ 'max-height': '400px', 'overflow-y': 'auto' }"
          node-key="id"
          :expand-on-click-node="false"
          :data="scope.deptNode.data"
          :props="{ children: 'children', label: 'label' }"
          @node-click="
            data => {
              scope.deptNode.id = data.id
              scope.deptNode.value = data.label
            }
          "
        />
        <el-input
          slot="reference"
          v-model="scope.deptNode.value"
          placeholder="请选择所属部门"
          readonly
        />
      </el-popover>
    </template>
    <template #slot-roles="{ scope }">
      <el-select
        v-model="scope.roles.value"
        multiple
        placeholder="请选择"
        style="width: 100%;"
        :multiple-limit="3"
      >
        <el-option
          v-for="item in scope.roles.data"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </template>
    <template #slot-status="{ scope }">
      <el-radio-group v-model="scope.status">
        <el-radio :label="1">启用</el-radio>
        <el-radio :label="0">禁用</el-radio>
      </el-radio-group>
    </template>
  </form-dialog>
</template>

<script>
import { getRoleList } from '@/api/sys/role'
import { createUser, getUserInfo, updateUser } from '@/api/sys/user'
import { isNumber } from 'lodash'

export default {
  name: 'SystemPermissionUserFormDialog',
  data() {
    return {
      updateId: -1
    }
  },
  methods: {
    async handleSubmit(data, { done, close }) {
      const { deptNode, roles } = data
      delete data.deptNode
      delete data.roles
      // dept id
      data.departmentId = deptNode.id
      data.roles = roles.value
      let req = null

      if (this.updateId === -1) {
        // create
        req = createUser(data)
      } else {
        data.id = this.updateId
        req = updateUser(data)
      }
      req
        .then(_ => {
          this.$emit('save-success')
          close()
        })
        .catch(() => {
          done()
        })
    },
    async handleOpen(depts, form, { showLoading, hideLoading, close, rebind }) {
      try {
        showLoading()
        const { data: roleData } = await getRoleList()
        if (this.updateId === -1) {
          // create
          form.roles.data = roleData
        } else {
          // update
          const { data: userData } = await getUserInfo({
            userId: this.updateId
          })
          const { roles } = userData
          userData.roles = {
            value: roles,
            data: roleData
          }
          userData.deptNode = {
            id: userData.departmentId,
            value: userData.departmentName,
            data: depts
          }
          rebind(userData)
        }
        hideLoading()
      } catch {
        close()
      }
    },
    open(depts, updateId = -1) {
      if (!depts) {
        throw new Error('dept tree must not null')
      }
      if (!isNumber(updateId)) {
        throw new Error('update id must be a number')
      }
      this.updateId = updateId
      this.$refs.formDialog.open({
        title: '编辑用户',
        on: {
          open: (form, methods) => { this.handleOpen(depts, form, methods) },
          submit: this.handleSubmit
        },
        items: [
          {
            label: '所属部门',
            prop: 'deptNode',
            value: { id: undefined, value: '', data: depts },
            rules: {
              required: true,
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (!value.id || !isNumber(value.id)) {
                  callback(new Error('请选择所属部门'))
                } else {
                  callback()
                }
              }
            },
            component: 'slot-dept-node'
          },
          {
            label: '所属角色',
            prop: 'roles',
            value: { value: [], data: [] },
            rules: {
              required: true,
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (value.value.length <= 0) {
                  callback(new Error('请选择所属角色'))
                } else {
                  callback()
                }
              }
            },
            component: 'slot-roles'
          },
          {
            label: '用户名',
            prop: 'username',
            value: '',
            rules: {
              required: true,
              trigger: 'blur',
              message: '请输入用户名'
            },
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入用户名'
              }
            }
          },
          {
            label: '姓名',
            prop: 'name',
            value: '',
            span: 12,
            rules: {
              required: true,
              trigger: 'blur',
              message: '请输入姓名'
            },
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入姓名'
              }
            }
          },
          {
            label: '呢称',
            prop: 'nickName',
            value: '',
            span: 12,
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入呢称'
              }
            }
          },
          {
            label: '邮箱',
            prop: 'email',
            value: '',
            span: 12,
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入邮箱'
              }
            }
          },
          {
            label: '手机',
            prop: 'phone',
            value: '',
            span: 12,
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入手机号码'
              }
            }
          },
          {
            label: '备注',
            prop: 'remark',
            value: '',
            component: {
              name: 'el-input',
              props: {
                type: 'textarea',
                rows: 2
              }
            }
          },
          {
            label: '状态',
            prop: 'status',
            value: 1,
            component: 'slot-status'
          }
        ]
      })
    }
  }
}
</script>
