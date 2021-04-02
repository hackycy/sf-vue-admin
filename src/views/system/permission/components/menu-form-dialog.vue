<template>
  <form-dialog
    :visible.sync="visible"
    :model="getModel"
    auth="sysMenu.update"
    title="编辑菜单"
  >
    aaa
  </form-dialog>
</template>

<script>
import FormDialog from '@/components/FormDialog'

export default {
  name: 'SystemPermissionMenuFormDialog',
  components: {
    FormDialog
  },
  data() {
    return {
      visible: false,
      isUpdate: false
    }
  },
  methods: {
    open(isUpdate = false) {
      this.visible = true
      this.isUpdate = isUpdate
    },
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
    getModel() {
      if (!this.isUpdate) {
        return this.getDefaultForm()
      }
    }
  }
}
</script>

<style></style>
