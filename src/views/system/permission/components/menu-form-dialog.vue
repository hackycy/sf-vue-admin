<template>
  <form-dialog ref="formDialog">
    <template #slot-type="{ scope }">
      <el-radio-group v-model="scope.type" @change="handleMenuTypeChange">
        <el-radio :label="0">目录</el-radio>
        <el-radio :label="1">菜单</el-radio>
        <el-radio :label="2">权限</el-radio>
      </el-radio-group>
    </template>
    <template #slot-perms="{ scope }">
      <permission-cascader v-model="scope.perms" />
    </template>
    <template #slot-parent-node-name="{ scope }">
      <el-popover placement="bottom-start" width="500">
        <el-tree
          :style="{ 'max-height': '400px', 'overflow-y': 'auto' }"
          node-key="id"
          :expand-on-click-node="false"
          :data="menus"
          :props="{ children: 'children', label: 'label' }"
          @node-click="
            data => {
              handleMenuNodeClick(data.id, data.label, scope)
            }
          "
        />
        <el-input
          slot="reference"
          v-model="scope.parentNode.name"
          placeholder="请选择上级节点"
          readonly
        />
      </el-popover>
    </template>
    <template #slot-icon="{ scope }">
      <menu-icon-selector v-model="scope.icon" />
    </template>
    <template #slot-view-path="{ scope }">
      <el-select
        v-model="scope.viewPath"
        placeholder="请选择文件路径"
        style="width: 100%;"
      >
        <el-option
          v-for="item in getViewFiles()"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </template>
  </form-dialog>
</template>

<script>
import { constantRouterComponents } from '@/router'
import PermissionCascader from './permission-cascader'
import MenuIconSelector from './menu-icon-selector'
import { isNumber } from 'lodash'
import { getMenuInfo, createMenu, updateMenu } from '@/api/sys/menu'
import PermissionMixin from '../../mixin/permission'

export default {
  name: 'SystemPermissionMenuFormDialog',
  components: {
    PermissionCascader,
    MenuIconSelector
  },
  mixins: [PermissionMixin],
  data() {
    return {
      menuId: -1,
      selectedParendId: -1,
      menus: []
    }
  },
  methods: {
    handleMenuTypeChange() {
      if (this.$refs.formDialog) {
        this.$refs.formDialog.clearValidate()
      }
    },
    handleMenuNodeClick(id, label, scope) {
      scope.parentNode.id = id
      scope.parentNode.name = label
    },
    getViewFiles() {
      return Object.keys(constantRouterComponents)
    },
    handleOpen(form, { showLoading, hideLoading, close, set }) {
      if (this.menuId !== -1) {
        // update mode
        showLoading()
        getMenuInfo({ menuId: this.menuId })
          .then(res => {
            const { menu, parentMenu } = res.data
            menu.parentNode = {
              id: parentMenu ? menu.parentId : -1,
              name: parentMenu ? parentMenu.name : '一级菜单'
            }
            // merge
            for (const fk in form) {
              if (menu[fk]) {
                form[fk] = menu[fk]
              }
            }

            hideLoading()
          })
          .catch(() => {
            close()
          })
      }
    },
    handleSubmit(data, { close, done }) {
      const { parentNode } = data
      delete data.parentNode
      data.parentId = parentNode.id
      let req = null

      if (this.menuId === -1) {
        // create
        req = createMenu(data)
      } else {
        data.menuId = this.menuId
        req = updateMenu(data)
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
    open(menus, menuId) {
      if (menuId && !isNumber(menuId)) {
        throw new Error('menuId is not invalid')
      }
      if (!menus) {
        throw new Error('menu must be not null')
      }
      this.menuId = menuId ?? -1
      this.menus = menus
      this.$refs.formDialog.open({
        title: '编辑菜单',
        on: {
          open: this.handleOpen,
          submit: this.handleSubmit
        },
        items: [
          {
            label: '菜单类型',
            prop: 'type',
            value: 0,
            rules: {
              required: true,
              message: '请选择菜单类型',
              trigger: 'blur'
            },
            component: 'slot-type'
          },
          {
            label: '节点名称',
            prop: 'name',
            value: '',
            rules: {
              required: true,
              message: '请输入正确的节点名称',
              trigger: 'blur'
            },
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入节点名称'
              }
            }
          },
          {
            label: '上级节点',
            prop: 'parentNode',
            value: { id: undefined, name: '' },
            rules: {
              required: true,
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (!value.id || !isNumber(value.id)) {
                  callback(new Error('请选择上级节点'))
                } else {
                  callback()
                }
              }
            },
            component: 'slot-parent-node-name'
          },
          {
            label: '节点路由',
            prop: 'router',
            value: '',
            hidden: ({ scope }) => {
              return scope.type === 2
            },
            rules: {
              required: true,
              message: '请输入正确的节点路由',
              trigger: 'blur'
            },
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入节点路由'
              }
            }
          },
          {
            label: '权限',
            prop: 'perms',
            value: '',
            hidden: ({ scope }) => {
              return scope.type !== 2
            },
            rules: { required: true, message: '请选择权限', trigger: 'blur' },
            component: 'slot-perms'
          },
          {
            label: '节点图标',
            prop: 'icon',
            value: '',
            hidden: ({ scope }) => {
              return scope.type === 2
            },
            component: 'slot-icon'
          },
          {
            label: '节点路径',
            prop: 'viewPath',
            value: '',
            hidden: ({ scope }) => {
              return scope.type !== 1
            },
            component: 'slot-view-path'
          },
          {
            label: '是否缓存',
            prop: 'keepalive',
            value: true,
            hidden: ({ scope }) => {
              return scope.type !== 1
            },
            component: {
              name: 'el-switch'
            }
          },
          {
            label: '是否显示',
            prop: 'isShow',
            value: true,
            hidden: ({ scope }) => {
              return scope.type === 2
            },
            component: {
              name: 'el-switch'
            }
          },
          {
            label: '排序号',
            prop: 'orderNum',
            value: 255,
            component: {
              name: 'el-input-number',
              style: {
                width: '100%'
              },
              props: {
                'controls-position': 'right',
                min: 0
              }
            }
          }
        ]
      })
    }
  }
}
</script>
