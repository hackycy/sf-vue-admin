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
        :data="tableData"
        size="small"
        style="width: 100%;margin-bottom: 20px;"
        :highlight-current-row="true"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="date" label="名称" width="140" />
        <el-table-column prop="name" label="图标" width="80" align="center" />
        <el-table-column prop="address" label="类型" width="80" align="center" />
        <el-table-column prop="address" label="节点路由" align="center" />
        <el-table-column prop="address" label="路由缓存" width="120" align="center" />
        <el-table-column prop="address" label="文件路径" align="center" />
        <el-table-column prop="address" label="权限" width="120" align="center" />
        <el-table-column prop="address" label="排序号" width="80" align="center" />
        <el-table-column prop="address" label="更新时间" width="140" align="center" />
        <el-table-column prop="address" label="操作" width="140" align="center" />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SystemPermissionMenu',
  data() {
    return {
      tableData: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        children: [{
          id: 31,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          id: 32,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }]
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      tableData1: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        hasChildren: true
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  created() {
    // console.log(this.$service.sys.menu.list())
  },
  methods: {
    load(tree, treeNode, resolve) {
      setTimeout(() => {
        resolve([
          {
            id: 31,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            id: 32,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }
        ])
      }, 1000)
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
      background-color: #ebeef4;
    }
  }

}
</style>
