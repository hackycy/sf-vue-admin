<template>
  <div class="user-container">
    <div class="dept-container">
      <dept-pane @current-change="handleCurrentDeptChangeEvent" />
    </div>
    <div class="user-pane-container">
      <div class="user-header">用户管理</div>
      <div class="user-option">
        <el-button size="mini" @click="handleRefreshUser">刷新</el-button>
        <el-button size="mini" type="primary" @click="handleAddUser">新增</el-button>
        <el-button
          size="mini"
          type="danger"
          :disabled="enbaleMultipleDelete"
          @click="handleMultipleDelete"
        >删除</el-button>
        <el-button
          size="mini"
          type="success"
          :disabled="enbaleMultipleTransfer"
          @click="handleMultipleTrensfer"
        >转移</el-button>
      </div>
      <div class="user-content">
        <el-table
          v-loading="isUserTableLoading"
          :data="users"
          border
          size="small"
          :header-cell-style="{ backgroundColor: '#ebeef4' }"
          style="width: 100%"
          @selection-change="handleSelectionUserChange"
        >
          <el-table-column fixed="left" type="selection" width="55" align="center" />
          <el-table-column prop="headImg" label="头像" align="center" width="80">
            <template slot-scope="scope">
              <el-avatar v-if="!scope.row.headImg" size="small" icon="el-icon-user-solid" />
              <el-avatar v-else size="small" :src="scope.row.headImg" />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" align="center" width="150" />
          <el-table-column prop="departmentName" label="部门名称" align="center" width="120" />
          <el-table-column prop="username" label="登录账号" align="center" width="220" />
          <el-table-column prop="nickName" label="呢称" width="160" align="center" />
          <el-table-column prop="email" label="邮箱" align="center" width="300" />
          <el-table-column prop="phone" label="手机" align="center" width="300" />
          <el-table-column prop="remark" label="备注" align="center" width="300" />
          <el-table-column prop="status" label="状态" align="center" width="100">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status === 1 ? 'success' : 'danger'"
                effect="dark"
                size="small"
              >{{ scope.row.status === 1 ? '启用' : '禁用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="handleEditUser(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="handleDeleteUser(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="user-footer">
        <el-pagination
          background
          :current-page="currentUserPage"
          :total="userTotalCount"
          :page-size="userPageSize"
          :page-sizes="[25, 50, 75, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 用户新增编辑弹窗 -->
    <user-dialog
      :user-id="editerUserId"
      :mode="editerUserDialogMode"
      :visible="editerUserDialogVisible"
      @success="handleAddUserSuccessEvent"
      @dismiss="editerUserDialogVisible = false"
    />
    <transfer-dialog
      :user-ids="editerTransferUserIdList"
      :visible="editerTransferDialogVisible"
      @success="handleTransferUserSuccessEvent"
      @dismiss="editerTransferDialogVisible = false"
    />
  </div>
</template>

<script>
import UserDialog from './components/user-dialog'
import TransferDialog from './components/transfer-dialog'
import DeptPane from './components/dept-pane'

export default {
  name: 'SysPermissionUser',
  components: {
    UserDialog,
    TransferDialog,
    DeptPane
  },
  data() {
    return {
      editerUserDialogVisible: false,
      editerUserDialogMode: 0,
      editerUserId: -1,
      editerTransferDialogVisible: false,
      editerTransferUserIdList: [],
      // 当前选中的部门ID
      currentDepartmentId: -1,
      multipleSelectionUserList: [],
      users: [],
      // 分页处理
      isUserTableLoading: false,
      currentUserPage: 1,
      userTotalCount: 0,
      userPageSize: 25
    }
  },
  computed: {
    enbaleMultipleDelete() {
      return !(
        this.multipleSelectionUserList &&
        this.multipleSelectionUserList.length > 0
      )
    },
    enbaleMultipleTransfer() {
      return !(
        this.multipleSelectionUserList &&
        this.multipleSelectionUserList.length > 0
      )
    }
  },
  created() {
    this.handleRefreshUser()
  },
  methods: {
    async userList() {
      this.isUserTableLoading = true
      const { data } = await this.$service.sys.user.page({
        departmentId: this.currentDepartmentId,
        page: this.currentUserPage,
        limit: this.userPageSize
      })
      const { users, userTotalCount } = data
      if (users) {
        this.users = users
      }
      this.userTotalCount = userTotalCount
      this.isUserTableLoading = false
    },
    async userDelete(userIds) {
      if (userIds && userIds.length > 0) {
        try {
          await this.$service.sys.user.delete({ userIds })
          this.handleRefreshUser()
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        } catch (e) {
          this.$message({
            type: 'danger',
            message: '删除失败'
          })
        }
      }
    },
    handleRefreshUser() {
      this.users = []
      this.userList()
    },
    handleAddUser() {
      this.editerUserDialogMode = 0
      this.editerUserDialogVisible = true
    },
    handleEditUser(row) {
      this.editerUserDialogMode = 1
      this.editerUserId = row.id
      this.editerUserDialogVisible = true
    },
    handleAddUserSuccessEvent() {
      this.handleRefreshUser()
    },
    handleCurrentDeptChangeEvent(id) {
      this.currentDepartmentId = id
      this.handleRefreshUser()
    },
    handleSelectionUserChange(val) {
      this.multipleSelectionUserList = val
    },
    handleSizeChange(val) {
      this.userPageSize = val
      this.handleRefreshUser()
    },
    handleCurrentChange(val) {
      this.currentUserPage = val
      this.handleRefreshUser()
    },
    handleDeleteUser(row) {
      // delete
      this.$confirm('此操作将永久删除且无法还原, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.userDelete([row.id])
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    handleMultipleDelete() {
      // delete
      this.$confirm('此操作将永久删除且无法还原, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const userIds = this.multipleSelectionUserList.map((e) => {
            return e.id
          })
          this.userDelete(userIds)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    handleMultipleTrensfer() {
      const userIds = this.multipleSelectionUserList.map((e) => {
        return e.id
      })
      this.editerTransferUserIdList = userIds
      this.editerTransferDialogVisible = true
    },
    handleTransferUserSuccessEvent(data) {
      const { departmentId } = data
      this.currentDepartmentId = departmentId
      this.handleRefreshUser()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin';

.user-container {
  padding: 10px;
  height: 100%;
  width: 100%;
  background-color: #f7f7f7;
  position: relative;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;

  .dept-container {
    background-color: white;
    height: 100%;
    width: 320px;
    min-width: 320px;
    border-radius: 4px;
  }

  .user-pane-container {
    height: 100%;
    width: 0;
    background-color: white;
    padding-bottom: 10px;
    padding-left: 10px;
    padding-right: 10px;
    flex-grow: 1;
    margin-left: 15px;
    border-radius: 4px;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;

    .user-header {
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
    }

    .user-option {
      margin-bottom: 10px;
    }

    .user-content {
      width: 100%;
      flex-grow: 1;
      overflow-y: auto;
      @include scrollBar;
    }

    .user-footer {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

<style lang="scss">
.user-pane-container {
  .user-content {
    .el-avatar--small {
      vertical-align: middle;
    }
  }
}
</style>
