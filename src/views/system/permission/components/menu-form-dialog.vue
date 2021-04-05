<template>
  <form-dialog
    :visible.sync="visible"
    :handle-ok="handleOk"
    :data="getDefaultForm"
    auth="sysMenu.update"
    title="编辑菜单"
  >
    <template v-slot:default="slotProps">
      <el-form-item label="权限" label-width="80px" prop="perms">
        <permission-cascader v-model="slotProps.form.perms" />
      </el-form-item>
    </template>
  </form-dialog>
</template>

<script>
import FormDialog from '@/components/FormDialog'
import PermissionCascader from './permission-cascader'

export default {
  name: 'SystemPermissionMenuFormDialog',
  components: {
    FormDialog,
    PermissionCascader
  },
  data() {
    return {
      visible: false,
      isUpdate: false,
      menuId: -1
    }
  },
  methods: {
    getDefaultForm() {
      return {
        type: 0,
        name: '',
        parentId: -1,
        parentNodeName: '',
        router: '',
        perms: '',
        icon: '',
        orderNum: 0,
        viewPath: '',
        isShow: true,
        keepalive: true
      }
    },
    open(isUpdate = false, menuId) {
      if (isUpdate && !menuId) {
        throw new Error('update menu need menu id!')
      }
      this.visible = true
      this.isUpdate = isUpdate
    },
    async getMenuInfo() {

    },
    handleOk(form) {
      console.log(form)
    }
  }
}
</script>

<style></style>
