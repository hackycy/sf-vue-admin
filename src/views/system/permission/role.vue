<template>
  <div class="sys-menu-container">
    <table-layout>
      <s-table :data-request="getRoleList" show-pagination stripe>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="name" label="名称" align="center" />
        <el-table-column prop="label" label="标识" align="center" />
        <el-table-column prop="remark" label="备注" align="center" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column prop="updateTime" label="更新时间" align="center" />
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </s-table>
    </table-layout>
  </div>
</template>

<script>
import TableLayout from '@/layout/components/TableLayout'
import STable from '@/components/Table'
import { getRoleListByPage } from '@/api/sys/role'

export default {
  name: 'SystemPermissionRole',
  components: {
    TableLayout,
    STable
  },
  methods: {
    async getRoleList({ page, limit }) {
      const { data } = await getRoleListByPage({ page, limit })
      return { list: data.list, pagination: { total: data.pagination.total }}
    }
  }
}
</script>

<style>

</style>
