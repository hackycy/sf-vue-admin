<template>
  <div class="sys-menu-container">
    <s-table
      :data-request="getMenuList"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
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
          <el-tag size="small" effect="dark">{{
            getMenuType(scope.row.type)
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="router"
        label="节点路由"
        align="center"
        width="240"
      />
      <el-table-column
        prop="keepalive"
        label="路由缓存"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <i
            v-if="scope.row.keepalive && scope.row.type === 1"
            class="el-icon-check"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="viewPath"
        label="文件路径"
        align="center"
        width="280"
      />
      <el-table-column
        prop="perms"
        label="权限"
        header-align="center"
        width="300"
      >
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
      <el-table-column
        prop="orderNum"
        label="排序号"
        width="80"
        align="center"
      />
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="180"
        align="center"
      />
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template>
          <el-button
            size="mini"
            type="text"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
          >删除</el-button>
        </template>
      </el-table-column>
    </s-table>
  </div>
</template>

<script>
import STable from '@/components/Table'
import { getMenuList } from '@/api/sys/menu'
import PermissionMixin from '../mixin/permission'

export default {
  name: 'SystemPermissionMenu',
  components: {
    STable
  },
  mixins: [PermissionMixin],
  data() {
    return {}
  },
  methods: {
    async getMenuList() {
      const { data } = await getMenuList()
      return { list: this.filterMenuToTable(data, null) }
    },
    /**
     * 将对应菜单类型转为字符串字意
     */
    getMenuType(type) {
      switch (type) {
        case 0:
          return '目录'
        case 1:
          return '菜单'
        case 2:
          return '权限'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
