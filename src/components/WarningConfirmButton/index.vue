<template>
  <el-button
    :size="size"
    :type="buttonType"
    :disabled="disabled"
    @click.stop="_handleClick"
  >
    {{ text }}
  </el-button>
</template>

<script>
export default {
  name: 'WarningConfirmButton',
  props: {
    text: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: '警告'
    },
    confirmButtonText: {
      type: String,
      default: '确定'
    },
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    iconType: {
      type: String,
      default: 'warning'
    },
    size: {
      type: String,
      default: 'mini'
    },
    buttonType: {
      type: String,
      default: 'text'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    closed: {
      type: Function,
      default: function() {
        return () => {}
      }
    },
    cancel: {
      type: Function,
      default: function() {
        return () => {}
      }
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    _handleClick() {
      this.$confirm(this.content, this.title, {
        confirmButtonText: this.confirmButtonText,
        cancelButtonText: this.cancelButtonText,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.$emit('confirm', {
              close: done,
              done: () => {
                instance.confirmButtonLoading = false
              }
            })
          } else {
            // 取消时手动自动关闭加载
            instance.confirmButtonLoading = false
            done()
          }
        }
      })
        .then(act => {
          this.closed()
        })
        .catch(e => {
          this.cancel()
        })
    }
  }
}
</script>
