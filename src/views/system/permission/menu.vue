<template>
  <div class="menu-container">
    <div class="menu-header">
      <el-button size="mini" @click="handleRefresh">刷新</el-button>
      <el-button size="mini" type="primary" @click="handleAdd">新增</el-button>
    </div>
    <div class="menu-content">
      <el-table
        v-loading="isLoading"
        :data="menuData"
        size="small"
        default-expand-all
        style="width: 100%;"
        :header-cell-style="{ backgroundColor: '#ebeef4' }"
        row-key="id"
        border
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="name" label="名称" width="240">
          <template slot-scope="scope">
            <span style="margin-right: 16px">{{ scope.row.name }}</span>
            <el-tag
              v-if="!scope.row.isShow && scope.row.type !== 2"
              type="danger"
              effect="dark"
              size="small"
            >隐藏</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" width="60" align="center">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.icon" :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="80" align="center">
          <template slot-scope="scope">
            <el-tag type="small" effect="dark">{{ getMenuType(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="router" label="节点路由" align="center" width="240" />
        <el-table-column prop="keepalive" label="路由缓存" width="80" align="center">
          <template slot-scope="scope">
            <i v-if="scope.row.keepalive && scope.row.type === 1" class="el-icon-check" />
          </template>
        </el-table-column>
        <el-table-column prop="viewPath" label="文件路径" align="center" width="280" />
        <el-table-column prop="perms" label="权限" header-align="center" width="300">
          <template slot-scope="scope">
            <el-tag
              v-for="i in splitPerms(scope.row.perms)"
              :key="i"
              effect="dark"
              size="mini"
              class="tag-perm-item"
            >{{ i }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序号" width="80" align="center" />
        <el-table-column prop="updateTime" label="更新时间" width="180" align="center" />
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- dialog -->
    <menu-dialog
      :mode="dialogMode"
      :menu-tree="menuTree"
      :menu-id="editerDialogMenuId"
      :visible="editerDialogVisible"
      @success="handleSaveMenuSuccessEvent"
      @dismiss="editerDialogVisible = false"
    />
  </div>
</template>

<script>
import * as _ from 'lodash'
import MenuDialog from './components/menu-dialog'
import { filterMenuToTable, filterMenuToTree } from '@/utils/permission'

export default {
  name: 'SystemPermissionMenu',
  components: {
    MenuDialog
  },
  data() {
    return {
      isLoading: true,
      dialogMode: 0,
      editerDialogMenuId: -1,
      editerDialogVisible: false,
      menuData: [],
      menuTree: {
        data: [],
        props: {
          children: 'children',
          label: 'label'
        }
      }
    }
  },
  created() {
    this.handleRefresh()
  },
  methods: {
    async list() {
      const { data } = await this.$service.sys.menu.list()
      // table data
      this.menuData = filterMenuToTable(data, null)
      // form tree data
      const parentNode = { id: -1, label: '一级菜单' }
      parentNode.children = filterMenuToTree(data, null)
      this.menuTree.data.push(parentNode)
      this.isLoading = false
    },
    getMenuType(type) {
      switch (type) {
        case 0:
          return '目录'
        case 1:
          return '菜单'
        case 2:
          return '权限'
      }
    },
    splitPerms(perms) {
      if (perms) {
        const permsArray = perms.split(',')
        if (permsArray && permsArray.length > 0) {
          return permsArray
        }
      }
      return []
    },
    joinPerms(perms) {
      if (_.isEmpty(perms)) {
        return ''
      }
      const arr = perms.map(e => {
        return _.join(e, ':')
      })
      return _.join(arr, ',')
    },
    refreshMenu() {
      this.menuTree.data = []
      this.menuData = []
      this.list()
    },
    handleRefresh(event) {
      this.isLoading = true
      this.refreshMenu()
    },
    handleAdd(event) {
      this.dialogMode = 0
      this.editerDialogVisible = true
    },
    handleEdit(item) {
      // edit
      this.dialogMode = 1
      this.editerDialogMenuId = item.id
      this.editerDialogVisible = true
    },
    handleDelete(item) {
      // delete
      this.$confirm('此操作将永久删除且无法还原, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$service.sys.menu.delete({ menuId: item.id })
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.handleRefresh()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    handleSaveMenuSuccessEvent() {
      this.handleRefresh()
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-container {
  padding: 15px;
  height: 100%;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;

  .menu-header {
    margin-bottom: 15px;
  }

  .menu-content {
    flex-grow: 1;
    overflow-y: auto;

    .tag-perm-item {
      margin-right: 4px;
    }
  }
}
</style>
