<template>
  <div class="log-container">
    <div class="log-header">
      <el-button size="mini" @click="handleRefresh">刷新</el-button>
    </div>
    <div class="log-content">
      <el-table
        v-loading="isLoading"
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
        <el-table-column prop="params" show-overflow-tooltip label="请求参数" align="center" />
        <el-table-column prop="action" show-overflow-tooltip label="请求地址" align="center" />
        <el-table-column prop="createTime" label="操作时间" align="center" />
      </el-table>
      <div class="log-footer">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="pageSizes"
          layout="total, sizes, prev, pager, next"
          :page-size="pageSize"
          :total="totalLogs"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
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
      logs: [],
      currentPage: 1,
      pageSizes: [50, 100, 150, 200],
      pageSize: 50,
      totalLogs: 0
    }
  },
  created() {
    this.handleRefresh()
  },
  methods: {
    async list() {
      const { data } = await this.$service.sys.log.page({ page: this.currentPage, limit: this.pageSize })
      const { logs, count } = data
      if (logs && logs.length > 0) {
        this.logs = logs.map(e => { e.createTime = momentParseTime(e.createTime); return e })
        this.totalLogs = count
      }
      this.isLoading = false
    },
    refreshMenu() {
      this.logs = []
      this.list()
    },
    handleRefresh(event) {
      this.isLoading = true
      this.refreshMenu()
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.handleRefresh()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.handleRefresh()
    }
  }
}
</script>

<style lang="scss" scoped>
.log-container {
  padding: 15px;
  height: 100%;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;

  .log-header {
    margin-bottom: 15px;
  }

  .log-content {
    flex-grow: 1;
    overflow-y: auto;
  }

  .log-footer {
    margin-top: 20px;
    text-align: end;
  }
}
</style>
