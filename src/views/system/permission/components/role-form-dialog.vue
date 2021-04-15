<template>
  <form-dialog ref="formDialog" />
</template>

<script>
export default {
  name: 'SystemPermissionRoleFormDialog',
  methods: {
    open() {
      this.$refs.formDialog.open({
        title: '编辑角色',
        items: [
          {
            label: '名称',
            prop: 'name',
            value: '',
            span: 12,
            rules: {
              required: true,
              trigger: 'blur',
              message: '请输入角色名称'
            },
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入角色名称'
              }
            }
          },
          {
            label: '标识',
            prop: 'label',
            value: '',
            span: 12,
            rules: {
              required: true,
              trigger: 'blur',
              message: '请输入标识'
            },
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入标识'
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
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
