<template>
  <div class="sys-monitor-req-log-container">
    <table-layout>
      <template v-slot:header>
        <el-button size="mini" @click="handleRefresh">刷新</el-button>
      </template>
      <s-table ref="logTable" :data-request="getReqLogList" show-pagination stripe row-key="id" border>
        <el-table-column prop="ip" label="请求IP" align="center" />
        <el-table-column prop="userId" label="操作人ID" align="center" width="100" />
        <el-table-column prop="method" label="请求方式" width="90" align="center">
          <template slot-scope="scope">
            <el-tag size="small" effect="dark">{{
              scope.row.method
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="params" show-overflow-tooltip label="请求参数" align="center" />
        <el-table-column prop="action" show-overflow-tooltip label="请求地址" align="center" />
        <el-table-column prop="status" label="响应状态" width="120" align="center">
          <template slot-scope="scope">
            <el-tag size="small" :type="getStatusType(scope.row.status)">{{
              scope.row.status
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="consumeTime" label="耗时" width="120" align="center">
          <template slot-scope="scope">
            <el-tag size="small" :type="getConsumeTimeType(scope.row.consumeTime)">{{
              scope.row.consumeTime + 'ms'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间" align="center" />
      </s-table>
    </table-layout>
  </div>
</template>

<script>
import TableLayout from '@/layout/components/TableLayout'
import STable from '@/components/Table'
import { getReqLogList } from '@/api/sys/log'

export default {
  name: 'SystemMonitorReqLog',
  components: {
    TableLayout,
    STable
  },
  methods: {
    async getReqLogList({ page, limit }) {
      const { data } = await getReqLogList({ page, limit })
      return data
    },
    handleRefresh() {
      this.$refs.logTable.refresh()
    },
    getStatusType(status) {
      if (status >= 200 && status < 300) {
        return 'success'
      } else if (status >= 300 && status < 400) {
        return 'info'
      } else if (status >= 400 && status < 500) {
        return 'warning'
      } else if (status >= 500) {
        return 'danger'
      } else {
        return 'info'
      }
    },
    getConsumeTimeType(time) {
      if (time <= 20) {
        return 'success'
      } else if (time <= 40) {
        return 'warning'
      } else {
        return 'danger'
      }
    }
  }
}
</script>

<style>

</style>
