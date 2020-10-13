<template>
  <div class="log-container">
    <div class="log-header">
      <el-button size="mini" @click="handleRefresh">刷新</el-button>
    </div>
    <div class="log-content">
      <el-table
        v-loading="isLoading"
        max-height="750"
        :data="logs"
        size="small"
        default-expand-all
        style="width: 100%;"
        :header-cell-style="{ backgroundColor: '#ebeef4' }"
        row-key="id"
        border
      >
        <el-table-column prop="username" label="用户名" align="center" width="280" />
        <el-table-column prop="ip" label="登录IP" align="center" />
        <el-table-column prop="time" show-overflow-tooltip label="登陆时间" align="center" />
        <el-table-column prop="os" show-overflow-tooltip label="操作系统" align="center" />
        <el-table-column prop="browser" label="浏览器" align="center" />
      </el-table>
    </div>
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
      this.isLoading = true
      const { data } = await this.$service.sys.loginLog.page({ page: this.currentPage, limit: this.pageSize })
      const { list, pagination } = data
      if (list && list.length > 0) {
        this.logs = list.map(e => { e.createTime = momentParseTime(e.time); return e })
        this.totalLogs = pagination.total
      } else {
        this.totalLogs = 0
      }
      this.isLoading = false
    },
    handleRefresh(event) {
      this.list()
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.handleRefresh()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.handleRefresh()
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
    }
  }
}
</script>

<style lang="scss" scoped>
.log-container {
  padding: 15px;

  .log-header {
    margin-bottom: 15px;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .log-content {
    overflow-y: auto;
  }

  .log-footer {
    margin-top: 20px;
    text-align: end;
  }
}
</style>
