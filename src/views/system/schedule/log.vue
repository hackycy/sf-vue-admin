<template>
  <div class="sys-task-log-container">
    <table-layout>
      <template v-slot:header>
        <el-button size="mini" @click="handleRefresh">刷新</el-button>
      </template>
      <s-table ref="logTable" :data-request="getTaskLogList" show-pagination border>
        <el-table-column prop="id" label="日志编号" align="center" width="120" />
        <el-table-column prop="taskId" label="任务编号" align="center" width="120" />
        <el-table-column prop="name" show-overflow-tooltip label="任务名称" align="center" width="200" />
        <el-table-column prop="detail" show-overflow-tooltip label="异常信息" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag size="small" :type="getStatusType(scope.row.status)" effect="dark">{{
              getStatusTip(scope.row.status)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="执行时间" align="center" width="220" />
        <el-table-column prop="finishTime" label="完成时间" align="center" width="220" />
      </s-table>
    </table-layout>
  </div>
</template>

<script>
import STable from '@/components/Table'
import TableLayout from '@/layout/components/TableLayout'
import { getTaskLogList } from '@/api/sys/log'

export default {
  name: 'SystemScheduleTaskLog',
  components: {
    STable,
    TableLayout
  },
  methods: {
    async getTaskLogList({ page, limit }) {
      const { data } = await getTaskLogList()
      return data
    },
    handleRefresh() {
      this.$refs.logTable.refresh()
    },
    getStatusType(status) {
      switch (status) {
        case 0:
          return 'warning'
        case 1:
          return 'success'
        case 2:
          return 'danger'
      }
    },
    getStatusTip(status) {
      switch (status) {
        case 0:
          return '执行中'
        case 1:
          return '成功'
        case 2:
          return '失败'
      }
    }
  }
}
</script>
