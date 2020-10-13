<template>
  <div class="log-container">
    <div class="log-header">
      <el-button size="mini" @click="handleRefresh">刷新</el-button>
      <div>
        <el-input
          v-model="searchText"
          style="width: 300px; margin-right: 10px;"
          placeholder="请输入请求地址、IP、请求参数"
          size="mini"
          clearable
        />
        <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
      </div>
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
      isSearch: false,
      isLoading: true,
      logs: [],
      currentPage: 1,
      pageSizes: [50, 100, 150, 200],
      pageSize: 50,
      totalLogs: 0,
      searchText: ''
    }
  },
  created() {
    this.handleRefresh()
  },
  methods: {
    async list() {
      const { data } = await this.$service.sys.reqLog.page({ page: this.currentPage, limit: this.pageSize })
      const { list, pagination } = data
      if (list && list.length > 0) {
        this.logs = list.map(e => { e.createTime = momentParseTime(e.createTime); return e })
        this.totalLogs = pagination.total
      } else {
        this.totalLogs = 0
      }
      this.isLoading = false
    },
    async search() {
      const { data } = await this.$service.sys.reqLog.search({ page: this.currentPage, limit: this.pageSize, q: this.searchText })
      const { logs, count } = data
      if (logs && logs.length > 0) {
        this.logs = logs.map(e => { e.createTime = momentParseTime(e.createTime); return e })
        this.totalLogs = count
      } else {
        this.totalLogs = 0
      }
      this.isLoading = false
    },
    refreshLog() {
      this.isLoading = true
      this.logs = []
      if (this.isSearch) {
        this.search()
      } else {
        this.list()
      }
    },
    async handleSearch() {
      if (this.searchText === '') {
        this.$message({
          message: '请输入搜索内容',
          type: 'warning'
        })
        return
      }
      this.isSearch = true
      this.refreshLog()
    },
    handleRefresh(event) {
      this.isSearch = false
      this.refreshLog()
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.refreshLog()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.refreshLog()
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
