<template>
  <div class="sys-schedule-task-container">
    <table-layout>
      <template v-slot:header>
        <el-button size="mini" @click="handleRefresh">刷新</el-button>
        <el-button
          size="mini"
          type="primary"
          :disabled="!$auth('sysTask.add')"
          @click="handleAdd"
        >新增</el-button>
      </template>
      <s-table
        ref="taskTable"
        :data-request="getTaskList"
        show-pagination
        row-key="id"
      >
        <el-table-column label="#" type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="table-expand">
              <el-form-item label="任务ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="执行次数">
                <span>{{ props.row.limit }}</span>
              </el-form-item>
              <el-form-item label="执行间隔">
                <span>{{ props.row.every }} ms</span>
              </el-form-item>
              <el-form-item label="cron表达式">
                <span>{{ props.row.cron }} ms</span>
              </el-form-item>
              <el-form-item label="执行时间">
                <span>{{ props.row.startTime }} - {{ props.row.endTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          show-overflow-tooltip
          label="任务名称"
          align="center"
          width="240"
        />
        <el-table-column
          prop="service"
          show-overflow-tooltip
          label="调用服务"
          width="350"
          align="center"
        />
        <el-table-column
          prop="data"
          show-overflow-tooltip
          label="执行参数"
          width="450"
          align="center"
        />
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template slot-scope="scope">
            <span class="badge-status">
              <span
                :class="{ dot: true, processing: scope.row.status === 1 }"
                :style="{
                  '--color': getStatusColor(scope.row.status)
                }"
              />
              <span class="tip">{{ getStatusInfo(scope.row.status) }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100" align="center">
          <template slot-scope="scope">
            <el-tag type="small" effect="light">{{
              scope.row.type === 1 ? 'interval' : 'cron'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          show-overflow-tooltip
          label="备注"
          width="250"
          align="center"
        />
      </s-table>
    </table-layout>
  </div>
</template>

<script>
import TableLayout from '@/layout/components/TableLayout'
import STable from '@/components/Table'
import { getTaskList } from '@/api/sys/task'

export default {
  name: 'SystemScheduleTask',
  components: {
    TableLayout,
    STable
  },
  methods: {
    async getTaskList({ page, limit }) {
      const { data } = await getTaskList({ page, limit })
      return data
    },
    handleRefresh() {
      this.$refs.taskTable.refresh()
    },
    handleAdd() {},
    getStatusInfo(status) {
      switch (status) {
        case 0:
          return '停止'
        case 1:
          return '运行'
      }
    },
    getStatusColor(status) {
      switch (status) {
        case 0:
          return '#d9d9d9'
        case 1:
          return '#52c41a'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes DotStatusProcessing {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
}

.sys-schedule-task-container {

  .table-expand {
    label {
      width: 90px;
      color: #99a9bf;
    }
  }

  .badge-status {
    position: relative;
    line-height: inherit;
    vertical-align: baseline;
    display: inline-block;

    .dot {
      top: -1px;
      display: inline-block;
      width: 6px;
      height: 6px;
      vertical-align: middle;
      border-radius: 50%;
      background-color: #{'var(--color)'};
    }

    .processing {
      position: relative;
      background-color: #{'var(--color)'};

      &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 1px solid #{'var(--color)'};
        border-radius: 50%;
        animation: DotStatusProcessing 1.2s infinite ease-in-out;
        content: '';
      }
    }

    .tip {
      margin-left: 6px;
    }
  }
}
</style>
