<template>
  <el-dialog
    v-el-drag-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :visible="visible"
    :title="title"
    :top="top"
    center
    :before-close="handleClose"
    @open="handleDialogOpen"
    @opened="$emit('opened')"
    @close="$emit('close')"
    @closed="$emit('closed')"
  >
    <div v-loading="formLoading" class="form-container">
      <el-form ref="form" :model="localForm" :rules="rules">
        <slot :form="localForm" />
      </el-form>
    </div>
    <span slot="footer">
      <el-row type="flex" justify="end">
        <el-button size="mini" @click="preCancel">取 消</el-button>
        <el-button
          size="mini"
          :disabled="checkAuth()"
          :loading="okBtnLoading"
          type="primary"
          @click="preOk"
        >确 定</el-button>
      </el-row>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'FormDialog',
  props: {
    data: {
      type: [Function, Object],
      default: function() {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '50%'
    },
    top: {
      type: String,
      default: '15vh'
    },
    rules: {
      type: Object,
      default: function() {
        return {}
      }
    },
    /**
     * 确定按钮权限禁用表达式
     */
    auth: {
      type: [Boolean, String],
      default: false
    },
    handleOk: {
      type: Function,
      default: function() {
        return () => {}
      }
    },
    handleCancel: {
      type: Function,
      default: function() {
        return () => {}
      }
    }
  },
  data() {
    return {
      okBtnLoading: false,
      formLoading: false,
      localForm: {}
    }
  },
  methods: {
    getForm() {
      return this.$refs.form
    },
    getFormData() {
      return this.localForm
    },
    resetFormData() {
      this.$refs.form && this.$refs.form.resetField()
    },
    handleDialogOpen() {
      this.$emit('open')
      if (typeof this.data === 'object') {
        Object.assign(this.localForm, this.data)
      } else {
        const result = this.data()
        if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
          this.formLoading = true
          this.result.then(obj => {
            Object.assign(this.localForm, obj)
            this.formLoading = false
          }).catch(() => {
            this.formLoading = false
          })
        } else {
          Object.assign(this.localForm, result)
        }
      }
      console.log(this.localForm)
    },
    preCancel() {
      this.handleCancel()
      this.handleClose()
    },
    preOk() {
      const result = this.handleOk(this.localForm)
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        this.okBtnLoading = true
        result.then(() => {
          this.okBtnLoading = false
          this.handleClose()
        }).catch(() => { this.okBtnLoading = false })
      } else {
        this.handleClose()
      }
    },
    /**
     * 通知关闭
     */
    handleClose() {
      this.$emit('update:visible', false)
    },
    /**
     * 检查确定按钮是否需要权限禁用
     */
    checkAuth() {
      if (typeof this.auth === 'boolean') {
        return this.auth
      }
      return !this.$auth(this.auth)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
