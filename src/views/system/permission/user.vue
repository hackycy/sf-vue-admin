<template>
  <div class="sys-user-container">
    <table-layout :wrap="false" asside-width="320px">
      <template #asside>
        <sys-dept-tree-pane ref="deptPane" @dept-change="handleDeptChange" />
      </template>
      <template #header>
        <div class="user-title">用户管理</div>
        <el-button size="mini" @click="handleRefresh">刷新</el-button>
        <el-button
          size="mini"
          type="primary"
          :disabled="!$auth('sysUser.add')"
          @click="handleAdd"
        >新增</el-button>
        <warning-confirm-button
          button-type="danger"
          :closed="handleRefresh"
          :disabled="!$auth('sysUser.delete') || disableMultipleDelete"
          @confirm="handleMultipleDelete"
        >删除</warning-confirm-button>
      </template>
      <template>
        <s-table
          ref="userTable"
          :data-request="getUserList"
          :show-pagination="true"
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            fixed="left"
            type="selection"
            width="55"
            align="center"
          />
          <el-table-column
            prop="headImg"
            label="头像"
            align="center"
            width="80"
          >
            <template slot-scope="scope">
              <el-avatar
                v-if="!scope.row.headImg"
                size="small"
                icon="el-icon-user-solid"
              />
              <el-avatar v-else size="small" :src="scope.row.headImg" />
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            align="center"
            width="150"
          />
          <el-table-column
            prop="departmentName"
            label="部门"
            align="center"
            width="120"
          />
          <el-table-column
            prop="username"
            label="用户名"
            align="center"
            width="220"
          />
          <el-table-column
            prop="roleNames"
            label="所属角色"
            align="center"
            header-align="center"
            width="220"
          >
            <template slot-scope="scope">
              <el-tag
                v-for="i in scope.row.roleNames"
                :key="i"
                type="success"
                size="small"
                :style="{ 'margin-right': '3px' }"
              >{{ i }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="nickName"
            label="呢称"
            width="160"
            align="center"
          />
          <el-table-column
            prop="email"
            label="邮箱"
            align="center"
            width="300"
          />
          <el-table-column
            prop="phone"
            label="手机"
            align="center"
            width="300"
          />
          <el-table-column
            prop="remark"
            label="备注"
            align="center"
            width="300"
          />
          <el-table-column
            prop="status"
            label="状态"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status === 1 ? 'success' : 'danger'"
                effect="dark"
                size="small"
              >{{ scope.row.status === 1 ? '启用' : '禁用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="120"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                :disabled="!$auth('sysUser.update')"
                @click.stop="handleEdit(scope.row)"
              >编辑</el-button>
              <warning-confirm-button
                :closed="handleRefresh"
                :disabled="!$auth('sysUser.delete')"
                @confirm="(o) => { handleDelete(scope.row, o) }"
              >删除</warning-confirm-button>
            </template>
          </el-table-column>
        </s-table>
      </template>
    </table-layout>
    <system-permission-user-form-dialog ref="userFormDialog" @save-success="handleRefresh" />
  </div>
</template>

<script>
import { getUserListPage, deleteUsers } from '@/api/sys/user'
import STable from '@/components/Table'
import WarningConfirmButton from '@/components/WarningConfirmButton'
import TableLayout from '@/layout/components/TableLayout'
import SysDeptTreePane from './components/dept-tree-pane'
import SystemPermissionUserFormDialog from './components/user-form-dialog'

export default {
  name: 'SystemPermissionUser',
  components: {
    STable,
    TableLayout,
    SysDeptTreePane,
    WarningConfirmButton,
    SystemPermissionUserFormDialog
  },
  data() {
    return {
      currentDeptId: -1,
      selectionUserList: []
    }
  },
  computed: {
    disableMultipleDelete() {
      return this.selectionUserList.length <= 0
    }
  },
  watch: {
    currentDeptId: function() {
      this.handleRefresh()
    }
  },
  methods: {
    async getUserList({ page, limit }) {
      const queryAll = this.currentDeptId === -1
      const { data } = await getUserListPage({
        page,
        limit,
        departmentIds: queryAll
          ? undefined
          : this.$refs.deptPane.getDeptIdChildrenById(this.currentDeptId)
      })
      return { list: data.list, pagination: { total: data.pagination.total }}
    },
    handleDeptChange(data) {
      this.currentDeptId = data.id
    },
    handleSelectionChange(selection) {
      if (!selection || selection.length <= 0) {
        this.selectionUserList = []
      } else {
        this.selectionUserList = selection.map(e => { return e.id })
      }
    },
    handleRefresh() {
      this.$refs.userTable.refresh()
    },
    handleAdd() {
      this.$refs.userFormDialog.open(this.$refs.deptPane.getDeptList())
    },
    handleEdit(row) {
      this.$refs.userFormDialog.open(this.$refs.deptPane.getDeptList(), row.id)
    },
    async handleDelete(row, { close, done }) {
      try {
        await deleteUsers({ userIds: [row.id] })
        close()
      } catch {
        done()
      }
    },
    async handleMultipleDelete({ close, done }) {
      try {
        await deleteUsers({ userIds: [...this.selectionUserList] })
        close()
      } catch {
        done()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sys-user-container {
  height: 100%;
  position: relative;

  .user-title {
    width: 100%;
    text-align: center;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1px;
    margin-bottom: 5px;
  }
}
</style>

<style lang="scss">
.sys-user-container {
  .table-layout-content {
    .el-avatar--small {
      vertical-align: middle;
    }
  }
}
</style>
