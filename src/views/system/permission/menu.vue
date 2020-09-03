<template>
  <div class="menu-container">
    <div class="menu-header">
      <el-row type="flex">
        <el-col :span="1">
          <el-button size="small">刷新</el-button>
        </el-col>
        <el-col :span="1">
          <el-button size="small" type="primary">新增</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="menu-content">
      <el-table
        :data="menuData"
        size="small"
        style="width: 100%;"
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
        <el-table-column prop="icon" label="图标" width="80" align="center">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.icon" :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="80" align="center">
          <template slot-scope="scope">
            <el-tag effect="dark">{{ getMenuType(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="router" label="节点路由" align="center" width="240" />
        <el-table-column prop="keepalive" label="路由缓存" width="80" align="center">
          <template slot-scope="scope">
            <i v-if="scope.row.keepalive && scope.row.type === 1" class="el-icon-check" />
          </template>
        </el-table-column>
        <el-table-column prop="viewPath" label="文件路径" align="center" width="240" />
        <el-table-column prop="perms" label="权限" header-align="center" width="240">
          <template slot-scope="scope">
            <el-tag v-for="i in splitPerms(scope.row.perms)" :key="i" effect="dark" size="mini" class="tag-perm-item">{{ i }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序号" width="80" align="center" />
        <el-table-column prop="updateTime" label="更新时间" width="200" align="center" />
        <el-table-column prop="address" label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

/**
 * 处理菜单数据
 */
function filterMenu(menus, parentMenu) {
  const res = []
  menus.forEach(menu => {
    // 根级别菜单渲染
    let realMenu
    if (!parentMenu && !menu.parentId && menu.type === 1) {
      // 根菜单
      realMenu = { ...menu }
    } else if (!parentMenu && !menu.parentId && menu.type === 0) {
      // 根目录
      const childMenu = filterMenu(menus, menu)
      realMenu = { ...menu }
      realMenu.children = childMenu
    } else if (parentMenu && parentMenu.id === menu.parentId && menu.type === 1) {
      // 子菜单下继续找是否有子菜单
      const childMenu = filterMenu(menus, menu)
      realMenu = { ...menu }
      realMenu.children = childMenu
    } else if (parentMenu && parentMenu.id === menu.parentId && menu.type === 0) {
      // 如果还是目录，继续递归
      const childMenu = filterMenu(menus, menu)
      realMenu = { ...menu }
      realMenu.children = childMenu
    } else if (parentMenu && parentMenu.id === menu.parentId && menu.type === 2) {
      realMenu = { ...menu }
    }
    // add curent route
    if (realMenu) {
      res.push(realMenu)
    }
  })
  return res
}

export default {
  name: 'SystemPermissionMenu',
  data() {
    return {
      menuData: []
    }
  },
  created() {
    this.list()
  },
  methods: {
    async list() {
      const { data } = await this.$service.sys.menu.list()
      this.menuData = filterMenu(data, null)
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
    handleEdit(item) {
      // edit
    },
    handleDelete(item) {
      // delete
    }
  }
}
</script>

<style lang='scss'>
.menu-container {
  padding: 15px;

  .menu-header {
    margin-bottom: 10px;
  }

  .menu-content {
    th {
      background-color: #ebeef4; //#5f6266
    }
    .tag-perm-item {
      margin-right: 4px;
    }
  }
}
</style>
