<template>
  <div class="online-container">
    <div class="online-header">
      <el-button size="mini" @click="handleRefresh">刷新</el-button>
    </div>
    <div class="online-content">
      <el-table
        v-loading="isLoading"
        max-height="850"
        :data="logs"
        size="small"
        default-expand-all
        style="width: 100%;"
        :header-cell-style="{ backgroundColor: '#ebeef4' }"
        row-key="id"
        border
      >
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
        <el-table-column prop="status" label="响应状态" width="90" align="center">
          <template slot-scope="scope">
            <el-tag size="small" :type="getStatusType(scope.row.status)">{{
              scope.row.status
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="操作时间" align="center" />
      </el-table>
    </div>
  </div>
</template>

<script>
import { momentParseTime } from '@/utils'

export default {
  name: 'SystemMonitorLog',
  data() {
    return {
      isLoading: true,
      logs: []
    }
  },
  created() {
    this.handleRefresh()
  },
  methods: {
    async list() {
      const { data } = await this.$service.sys.log.page({ page: this.currentPage, limit: this.pageSize })
      const { list, pagination } = data
      if (list && list.length > 0) {
        this.logs = list.map(e => { e.createTime = momentParseTime(e.createTime); return e })
        this.totalLogs = pagination.total
      } else {
        this.totalLogs = 0
      }
      this.isLoading = false
    },
    handleRefresh(event) {
      this.isSearch = false
    }
  }
}
</script>

<style lang="scss" scoped>
.online-container {
  padding: 15px;

  .online-header {
    margin-bottom: 15px;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
