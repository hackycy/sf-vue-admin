import { checkTaskStatus } from '@/api/netdisk/manage'

export default {
  methods: {
    /**
     * 每三秒轮训任务状态
     */
    pollingCheckStatus(action, taskId, { success, fail }) {
      this.$message.success('已加入后台任务处理...请勿重复操作')
      const val = setInterval(async() => {
        try {
          const { data } = await checkTaskStatus({
            action,
            taskId
          })
          if (data.status === 1) {
            setTimeout(() => {
              success && success()
            }, 3000)
            clearInterval(val)
          } else if (data.status === 2) {
            fail && fail(data.err)
            clearInterval(val)
          }
        } catch {
          clearInterval(val)
        }
      }, 3000)
    }
  }
}
