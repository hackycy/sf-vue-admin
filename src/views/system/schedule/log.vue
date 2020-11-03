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
        this.logs = list
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
