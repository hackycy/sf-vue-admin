<template>
  <div class="task-container">
    <div class="task-header">
      <el-button size="mini" @click="handleRefresh">刷新</el-button>
      <el-button
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
        <el-table-column prop="name" show-overflow-tooltip label="任务名称" align="center" width="200" />
        <el-table-column prop="service" show-overflow-tooltip label="调用服务" width="150" align="center" />
        <el-table-column prop="data" show-overflow-tooltip label="执行参数" width="200" align="center" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.status === 1 ? 'success' : 'danger'" effect="dark">{{
              scope.row.status === 1 ? '运行' : '暂停'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100" align="center">
          <template slot-scope="scope">
            <el-tag type="small" effect="dark">{{
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
            <el-dropdown>
              <el-button size="mini" type="text">
                执行<i style="margin-right: 10px;" class="el-icon-arrow-down el-icon--right" /></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>仅一次</el-dropdown-item>
                <el-dropdown-item :disabled="scope.row.status === 1">运行</el-dropdown-item>
                <el-dropdown-item :disabled="scope.row.status === 0">暂停</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
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
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.handleRefresh()
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.handleRefresh()
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
