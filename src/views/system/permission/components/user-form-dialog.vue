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
              scope.deptNode.name = data.label
            }
          "
        />
        <el-input
          slot="reference"
          v-model="scope.deptNode.name"
          placeholder="请选择所属部门"
          readonly
        />
      </el-popover>
    </template>
  </form-dialog>
</template>

<script>
import { isNumber } from 'lodash'

export default {
  name: 'SystemPermissionUserFormDialog',
  methods: {
    open(depts) {
      if (!depts) {
        throw new Error('dept tree must not null')
      }
      this.$refs.formDialog.open({
        title: '编辑用户',
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
          }
        ]
      })
    }
  }
}
</script>
