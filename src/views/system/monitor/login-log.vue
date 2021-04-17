<template>
  <div class="sys-login-log-container">
    <table-layout>
      <template v-slot:header>
        <el-button size="mini" @click="handleRefresh">刷新</el-button>
      </template>
      <s-table ref="logTable" :data-request="getLoginLogList" show-pagination stripe row-key="id">
        <el-table-column prop="username" label="用户名" align="center" width="280" />
        <el-table-column prop="ip" label="登录IP" align="center" />
        <el-table-column prop="time" show-overflow-tooltip label="登陆时间" align="center" />
        <el-table-column prop="os" show-overflow-tooltip label="操作系统" align="center" />
        <el-table-column prop="browser" label="浏览器" align="center" />
      </s-table>
    </table-layout>
  </div>
</template>

<script>
import TableLayout from '@/layout/components/TableLayout'
import STable from '@/components/Table'
import { getLoginLogList } from '@/api/sys/log'

export default {
  name: 'SystemMonitorLoginLog',
  components: {
    TableLayout,
    STable
  },
  methods: {
    async getLoginLogList({ page, limit }) {
      const { data } = await getLoginLogList({ page, limit })
      return data
    },
    handleRefresh() {
      this.$refs.logTable.refresh()
    }
  }
}
</script>
