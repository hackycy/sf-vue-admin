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
        <el-table-column prop="id" label="日志ID" align="center" width="120" />
        <el-table-column prop="taskId" label="任务ID" align="center" width="120" />
        <el-table-column prop="detail" show-overflow-tooltip label="异常信息" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.status === 1 ? 'success' : 'danger'" effect="dark">{{
              scope.row.status === 1 ? '成功' : '失败'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="执行时间" align="center" width="220" />
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
  name: 'SystemScheduleTaskLog',
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
      const { data } = await this.$service.sys.taskLog.page({ page: this.currentPage, limit: this.pageSize })
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
      this.list()
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

  .log-header {
    margin-bottom: 15px;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
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
