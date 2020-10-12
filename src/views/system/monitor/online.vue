<template>
  <div class="online-container">
    <div class="online-header">
      <el-button size="mini" @click="handleRefresh">刷新</el-button>
    </div>
    <div class="online-content">
      <el-table
        v-loading="isLoading"
        max-height="850"
        :data="users"
        size="small"
        default-expand-all
        style="width: 100%;"
        :header-cell-style="{ backgroundColor: '#ebeef4' }"
        row-key="id"
        border
      >
        <el-table-column prop="username" label="用户名" align="center">
          <template slot-scope="scope">
            <span style="margin-right: 16px">{{ scope.row.username }}</span>
            <el-tag
              v-if="scope.row.isCurrent"
              type="danger"
              effect="dark"
              size="small"
            >当前</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP" align="center" width="100" />
        <el-table-column prop="updateTime" show-overflow-tooltip label="更新时间" align="center" />
        <el-table-column prop="status" label="状态" width="90" align="center">
          <template slot-scope="scope">
            <el-tag size="small" type="dark">{{
              getStatusType(scope.row.status)
            }}</el-tag>
          </template>
        </el-table-column>
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
      users: []
    }
  },
  created() {
    this.handleRefresh()
  },
  methods: {
    async list() {
      const { data } = await this.$service.sys.online.list()
      if (data) {
        this.users = data.map(e => {
          e.updateTime = momentParseTime(e.updateTime)
          return e
        })
      }
      this.isLoading = false
    },
    handleRefresh(event) {
      this.isLoading = true
      this.list()
    },
    getStatusType(status) {
      if (status === 1) {
        return '在线'
      }
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
