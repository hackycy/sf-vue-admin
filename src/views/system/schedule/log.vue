<template>
  <div class="sys-task-log-container">
    <table-layout>
      <s-table ref="logTable" :data-request="getTaskLogList" show-pagination border>
        <el-table-column prop="id" label="#" align="center" width="80" />
        <el-table-column prop="taskId" label="任务编号" align="center" width="100" />
        <el-table-column prop="name" show-overflow-tooltip label="任务名称" align="center" width="200" />
        <el-table-column prop="detail" show-overflow-tooltip label="异常信息" align="center" />
        <el-table-column prop="consumeTime" label="耗时" align="center" width="120">
          <template slot-scope="scope">
            <el-tag size="small" type="primary">{{ scope.row.consumeTime + ' ms' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag size="small" :type="getStatusType(scope.row.status)" effect="dark">{{
              getStatusTip(scope.row.status)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="执行时间" align="center" width="220" />
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
      const { data } = await getTaskLogList({ page, limit })
      return data
    },
    handleRefresh() {
      this.$refs.logTable.refresh()
    },
    getStatusType(status) {
      switch (status) {
        case 0:
          return 'danger'
        case 1:
          return 'success'
      }
    },
    getStatusTip(status) {
      switch (status) {
        case 0:
          return '失败'
        case 1:
          return '成功'
      }
    }
  }
}
</script>
