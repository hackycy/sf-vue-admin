export default {
  methods: {
    openLoadingConfirm({ on, content = '此操作无法恢复，是否继续？', title = '警告',
      confirmButtonText = '确定', cancelButtonText = '取消', type = 'warning' }) {
      const { confirm, cancel, closed } = on
      this.$confirm(content, title, {
        confirmButtonText,
        cancelButtonText,
        type,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            if (confirm) {
              confirm({
                close: done,
                done: () => {
                  instance.confirmButtonLoading = false
                }
              })
            }
          } else {
            // 取消时手动自动关闭加载
            instance.confirmButtonLoading = false
            done()
          }
        }
      })
        .then(act => {
          if (closed) {
            closed(act)
          }
        })
        .catch(e => {
          if (cancel) {
            cancel()
          }
        })
    }
  }
}
