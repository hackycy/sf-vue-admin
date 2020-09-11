<template>
  <div class="dept-pane-container">
    <div class="dept-option-header">
      <span>组织架构</span>
      <ul>
        <li>
          <i class="el-icon-refresh" @click="handleRefreshDept" />
        </li>
      </ul>
    </div>
    <div v-loading="isDeptTreeLoading" class="dept-tree-content">
      <el-tree
        style="height: 100%;"
        :data="deptTree.data"
        highlight-current
        node-key="id"
        :expand-on-click-node="false"
        default-expand-all
        @current-change="handleDeptTreeCurrentChange"
        @node-contextmenu="handleDeptNodeContextMenuEvent"
        @contextmenu.prevent.native="openContextMenu($event)"
      />
    </div>
    <dept-dialog
      :dept-tree="deptTree"
      :visible="editerDeptDialogVisible"
      @success="handleSaveDeptSuccessEvent"
      @dismiss="editerDeptDialogVisible = false"
    />
    <!-- 右键菜单 -->
    <div
      v-if="contextMenuVisible"
      :style="{left: contextMenuPosition.left+'px', top: contextMenuPosition.top+'px'}"
      class="context-menu"
    >
      <div class="item" @click="handleAddDept">
        <span>新增</span>
        <i class="el-icon-plus" />
      </div>
      <div v-if="currentContextSelectDepartmentId !== -1" class="item">
        <span>编辑</span>
        <i class="el-icon-edit" />
      </div>
      <div v-if="currentContextSelectDepartmentId !== -1" class="item" @click="handleDeleteDept">
        <span>删除</span>
        <i class="el-icon-delete" />
      </div>
    </div>
  </div>
</template>

<script>
import { filterDeptToTree } from '@/utils/permission'
import DeptDialog from './dept-dialog'

export default {
  name: 'SysDeptPane',
  components: {
    DeptDialog
  },
  data() {
    return {
      contextMenuPosition: {
        left: 0,
        top: 0
      },
      contextMenuVisible: false,
      editerDeptDialogVisible: false,
      // 部门Tree
      // deptTreeDraggable: false,
      isDeptTreeLoading: false,
      deptTree: {
        data: [],
        props: {
          children: 'children',
          label: 'label'
        }
      },
      currentContextSelectDepartmentId: -1
    }
  },
  watch: {
    contextMenuVisible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  created() {
    this.handleRefreshDept()
  },
  methods: {
    async deptList() {
      this.isDeptTreeLoading = true
      const { data } = await this.$service.sys.dept.list()
      if (data) {
        this.deptTree.data = filterDeptToTree(data, null)
      }
      this.isDeptTreeLoading = false
    },
    handleRefreshDept() {
      this.deptTree.data = []
      this.deptList()
    },
    handleSaveDeptSuccessEvent() {
      this.handleRefreshDept()
    },
    handleDeptTreeCurrentChange(data) {
      this.$emit('current-change', data.id)
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
    handleMultipleTrensfer() {
      const userIds = this.multipleSelectionUserList.map((e) => {
        return e.id
      })
      this.editerTransferUserIdList = userIds
      this.editerTransferDialogVisible = true
    },
    handleDeptNodeContextMenuEvent(event, data, node) {
      this.currentContextSelectDepartmentId = data.id
      this.openContextMenu(event)
    },
    handleAddDept() {
      this.editerDeptDialogVisible = true
    },
    async handleDeleteDept() {
      if (this.currentContextSelectDepartmentId !== -1) {
        await this.$service.sys.dept.delete({ departmentId: this.currentContextSelectDepartmentId })
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.handleRefreshDept()
      }
    },
    openContextMenu(e) {
      // const menuMinWidth = 200
      // const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      // const offsetWidth = this.$el.offsetWidth // container width
      // const maxLeft = offsetWidth - menuMinWidth // left boundary
      // const left = e.clientX - offsetLeft + 15 // 15: margin right

      // if (left > maxLeft) {
      //   this.contextMenuPosition.left = maxLeft
      // } else {
      //   this.contextMenuPosition.left = left
      // }
      this.contextMenuPosition.left = e.clientX + 5
      this.contextMenuPosition.top = e.clientY + 5
      this.contextMenuVisible = true
    },
    closeMenu() {
      this.contextMenuVisible = false
      // reset
      this.currentContextSelectDepartmentId = -1
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin';

.dept-pane-container {
  background-color: white;
  height: 100%;
  // width: 300px;
  width: 100%;
  // min-width: 320px;
  border-radius: 4px;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;

  .context-menu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: fixed;
    // list-style-type: none;
    // padding: 5px 0;
    font-size: 13px;
    font-weight: 400;
    color: #333;
    box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.3);

    .item {
      padding: 14px 12px;
      cursor: pointer;

      i {
        margin-left: 65px;
      }

      &:hover {
        background: #eee;
      }
    }
  }

  .dept-option-header {
    color: #3b4151;
    padding-left: 15px;
    padding-right: 10px;
    align-items: center;
    height: 40px;
    letter-spacing: 1px;
    line-height: 40px;
    font-size: 14px;
    display: flex;
    display: -webkit-flex;

    span {
      flex-grow: 1;
    }

    ul {
      display: flex;
      flex-direction: row;

      li {
        cursor: pointer;
        font-size: 16px;
        list-style: none;
        padding: 0px;
        margin: 0px;
        margin-right: 5px;

        i {
          padding: 5px;

          &:hover {
            background-color: #cccccc40;
          }
        }
      }
    }
  }

  .dept-tree-content {
    flex-grow: 1;

    .el-tree-node__content {
      height: 32px !important;
    }

    .dept-tree-node {
      font-size: 15px;
    }
  }
}
</style>

<style lang="scss">
.dept-pane-container {
  .dept-tree-content {
    .el-tree-node__content {
      height: 36px !important;
    }
  }
}
</style>
