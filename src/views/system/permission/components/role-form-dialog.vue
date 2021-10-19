<template>
  <form-dialog ref="formDialog" />
</template>

<script>
import PermissionMixin from '@/core/mixins/permission'
import { getMenuList } from '@/api/sys/menu'

export default {
  name: 'SystemPermissionRoleFormDialog',
  mixins: [PermissionMixin],
  methods: {
    async handleOpen(updateId, form, { showLoading, hideLoading, close, $refs }) {
      try {
        showLoading()
        const { data: deptsData } = await this.$api.sys.dept.list()
        const { data: menusData } = await getMenuList()
        form.menus.data = this.filterMenuHasPermsToTree(menusData, null)
        form.depts.data = this.filterDeptToTree(deptsData, null)

        if (updateId !== -1) {
          // get role data
          const { data: result } = await this.$api.sys.role.info({ roleId: updateId })

          // set
          form.name = result.roleInfo.name
          form.label = result.roleInfo.label
          form.remark = result.roleInfo.remark

          const { menus, depts } = result

          // set node
          if (menus && menus.length > 0) {
            menus.forEach(m => {
              const node = $refs.menuTree.getNode(m.menuId)
              // console.log(node)
              if (node && node.isLeaf) {
                $refs.menuTree.setChecked(node, true)
              }
            })
          }

          if (depts && depts.length > 0) {
            depts.forEach(d => {
              const node = $refs.deptTree.getNode(d.departmentId)
              // console.log(node)
              if (node && node.isLeaf) {
                $refs.deptTree.setChecked(node, true)
              }
            })
          }
        }
        hideLoading()
      } catch {
        close()
      }
    },
    handleSubmit(updateId, data, { close, done, $refs }) {
      const menus = this.getMenuTreeCheckedKeys($refs)
      const depts = this.getDeptTreeCheckedKeys($refs)
      data.menus = menus
      data.depts = depts

      let req = null

      if (updateId === -1) {
        // create
        req = this.$api.sys.role.add(data)
      } else {
        data.roleId = updateId
        req = this.$api.sys.role.update(data)
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
    getMenuTreeCheckedKeys($refs) {
      const childKeys = $refs.menuTree.getCheckedKeys()
      const halfKeys = $refs.menuTree.getHalfCheckedKeys()
      return [...childKeys, ...halfKeys]
    },
    getDeptTreeCheckedKeys($refs) {
      const childKeys = $refs.deptTree.getCheckedKeys()
      const halfKeys = $refs.deptTree.getHalfCheckedKeys()
      return [...childKeys, ...halfKeys]
    },
    open(updateId = -1) {
      this.$refs.formDialog.open({
        title: '编辑角色',
        on: {
          open: (form, op) => {
            this.handleOpen(updateId, form, op)
          },
          submit: (form, op) => {
            this.handleSubmit(updateId, form, op)
          }
        },
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
          },
          {
            label: '菜单权限',
            prop: 'menus',
            span: 12,
            value: { data: [] },
            component: function(h, { scope }) {
              return h('el-tree', {
                class: { 'role-form-dialog-tree-container': true },
                props: {
                  data: scope.menus.data,
                  'show-checkbox': true,
                  'node-key': 'id',
                  'highlight-current': true,
                  props: {
                    children: 'children',
                    label: 'label'
                  }
                },
                ref: 'menuTree'
              })
            }
          },
          {
            label: '部门权限',
            prop: 'depts',
            span: 12,
            value: { data: [] },
            component: function(h, { scope }) {
              return h('el-tree', {
                class: { 'role-form-dialog-tree-container': true },
                props: {
                  data: scope.depts.data,
                  'show-checkbox': true,
                  'node-key': 'id',
                  'highlight-current': true,
                  props: {
                    children: 'children',
                    label: 'label'
                  }
                },
                ref: 'deptTree'
              })
            }
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss">
.role-form-dialog-tree-container {
  height: 300px;
  padding-top: 5px;
  overflow: auto;
  border-radius: 6px;
  border: 1px solid #dcdfe6;

  &:hover {
    border-color: #C0C4CC;
  }
}
</style>
