<template>
  <div class="sys-online-container">
    <table-layout>
      <s-table ref="onlineTable" :data-request="getOnlineList" row-key="id" border>
        <el-table-column prop="id" show-overflow-tooltip label="#" align="center" width="80" />
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
        <el-table-column prop="ip" show-overflow-tooltip label="登录IP" align="center" width="140" />
        <el-table-column prop="time" show-overflow-tooltip label="登录时间" align="center" />
        <el-table-column prop="os" show-overflow-tooltip label="操作系统" align="center" />
        <el-table-column prop="browser" show-overflow-tooltip label="浏览器" align="center" />
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template slot-scope="scope">
            <warning-confirm-button
              :closed="handleRefresh"
              content="确定下线该用户吗?"
              :disabled="!$auth('sys.online.kick') || scope.row.disable"
              @confirm="(o) => { handleKick(scope.row, o) }"
            >下线</warning-confirm-button>
          </template>
        </el-table-column>
      </s-table>
    </table-layout>
  </div>
</template>

<script>
import SocketHookMixin, { SOCKET_HOOK_KEY } from '@/core/mixins/socket-hook'
import TableLayout from '@/layout/components/TableLayout'
import STable from '@/components/Table'
import WarningConfirmButton from '@/components/WarningConfirmButton'

export default {
  name: 'SystemMonitorOnline',
  components: {
    TableLayout,
    STable,
    WarningConfirmButton
  },
  mixins: [SocketHookMixin],
  [SOCKET_HOOK_KEY]: {
    connect() {
      // connect auto refresh
      this.handleRefresh()
    },
    online() {
      // online event auto refresh
      this.handleRefresh()
    },
    offline() {
      this.handleRefresh()
    }
  },
  methods: {
    async getOnlineList() {
      const { data } = await this.$api.sys.online.list()
      return { list: data }
    },
    handleRefresh() {
      this.$refs.onlineTable.refresh()
    },
    async handleKick(row, { close }) {
      try {
        await this.$api.sys.online.kick({ id: row.id })
      } finally {
        close()
      }
    }
  }
}
</script>

