<template>
  <div class="task-container">
    <div class="task-header">
      <el-button size="mini" @click="handleRefresh">刷新</el-button>
      <el-button
        v-permission="$service.sys.task.permission.add"
        size="mini"
        type="primary"
        @click="handleAdd"
      >新增</el-button>
    </div>
    <div class="task-content">
      <el-table
        ref="taskTable"
        v-loading="isLoading"
        max-height="750"
        :data="tasks"
        size="small"
        style="width: 100%"
        :header-cell-style="{ backgroundColor: '#ebeef4' }"
        row-key="id"
        border
      >
        <el-table-column prop="id" label="ID" show-overflow-tooltip align="center" width="60" />
        <el-table-column prop="name" show-overflow-tooltip label="任务名称" align="center" width="180" />
        <el-table-column prop="service" show-overflow-tooltip label="调用服务" width="200" align="center" />
        <el-table-column prop="data" show-overflow-tooltip label="执行参数" width="200" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag size="small" :type="getStatusType(scope.row.status)" effect="dark">{{
              getStatusInfo(scope.row.status)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100" align="center">
          <template slot-scope="scope">
            <el-tag type="small" effect="light">{{
              scope.row.type === 1 ? 'interval' : 'cron'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="limit" show-overflow-tooltip label="执行次数" align="center" width="100" />
        <el-table-column prop="every" show-overflow-tooltip label="间隔(ms)" align="center" width="120" />
        <el-table-column prop="cron" show-overflow-tooltip label="cron" align="center" width="150" />
        <el-table-column prop="startTime" show-overflow-tooltip label="开始时间" width="200" align="center" />
        <el-table-column prop="endTime" show-overflow-tooltip label="结束时间" width="200" align="center" />
        <el-table-column prop="remark" show-overflow-tooltip label="备注" width="250" align="center" />
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template slot-scope="scope">
            <el-dropdown v-permission="{ or: [ $service.sys.task.permission.once, $service.sys.task.permission.start, $service.sys.task.permission.stop ] }" size="small">
              <el-button size="mini" type="text">
                执行<i style="margin-left: 4px; margin-right: 10px;" class="el-icon-arrow-down" /></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-permission="$service.sys.task.permission.once" @click.native="handleOnce(scope.row)">仅一次</el-dropdown-item>
                <el-dropdown-item v-permission="$service.sys.task.permission.start" :disabled="scope.row.status === 1" @click.native="handleStart(scope.row)">运行</el-dropdown-item>
                <el-dropdown-item v-permission="$service.sys.task.permission.stop" :disabled="scope.row.status === 0 || scope.row.status === 2" @click.native="handleStop(scope.row)">暂停</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              v-permission="$service.sys.task.permission.update"
              size="mini"
              type="text"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              v-permission="$service.sys.task.permission.delete"
              size="mini"
              type="text"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="task-footer">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="pageSizes"
        layout="total, sizes, prev, pager, next"
        :page-size="pageSize"
        :total="totalTasks"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- dialog -->
    <task-dialog
      :mode="dialogMode"
      :task-id="editerDialogTaskId"
      :visible="editerDialogVisible"
      @success="handleRefresh"
      @dismiss="editerDialogVisible = false"
    />
  </div>
</template>

<script>
import TaskDialog from './components/task-dialog'

export default {
  name: 'SystemScheduleTask',
  components: {
    TaskDialog
  },
  data() {
    return {
      isLoading: true,
      dialogMode: 0,
      editerDialogTaskId: -1,
      editerDialogVisible: false,
      tasks: [],
      currentPage: 1,
      pageSizes: [10, 20, 50, 100],
      pageSize: 10,
      totalTasks: 0
    }
  },
  created() {
    this.handleRefresh()
  },
  methods: {
    async page() {
      const { data } = await this.$service.sys.task.page({ limit: this.pageSize, page: this.currentPage })
      const { list, pagination } = data
      if (list && list.length > 0) {
        this.tasks = list
        this.totalTasks = pagination.total
      } else {
        this.totalTasks = 0
        this.tasks = []
      }
      this.isLoading = false
    },
    handleRefresh(event) {
      this.isLoading = true
      this.page()
    },
    handleAdd(event) {
      this.dialogMode = 0
      this.editerDialogVisible = true
    },
    handleEdit(item) {
      // edit
      this.dialogMode = 1
      this.editerDialogTaskId = item.id
      this.editerDialogVisible = true
    },
    async handleOnce(item) {
      await this.$service.sys.task.once({ id: item.id })
      this.$message.success('执行成功')
    },
    async handleStart(item) {
      await this.$service.sys.task.start({ id: item.id })
      this.handleRefresh()
      this.$message.success('执行成功')
    },
    async handleStop(item) {
      await this.$service.sys.task.stop({ id: item.id })
      this.handleRefresh()
      this.$message.success('执行成功')
    },
    handleDelete(item) {
      // delete
      this.$confirm('此操作将永久删除且无法还原, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$service.sys.task.delete({ id: item.id })
        this.$message.success('删除成功')
        this.handleRefresh()
      })
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.handleRefresh()
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.handleRefresh()
    },
    getStatusInfo(status) {
      switch (status) {
        case 0:
          return '暂停'
        case 1:
          return '运行'
        case 2:
          return '完成'
      }
    },
    getStatusType(status) {
      switch (status) {
        case 0:
          return 'info'
        case 1:
          return 'success'
        case 2:
          return 'warning'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.task-container {
  padding: 15px;
  height: 100%;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;

  .task-header {
    margin-bottom: 15px;
  }

  .task-content {
    flex-grow: 1;
    overflow-y: auto;
  }

  .task-footer {
    margin-top: 20px;
    text-align: end;
  }
}
</style>
