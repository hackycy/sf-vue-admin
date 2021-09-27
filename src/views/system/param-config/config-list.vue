<template>
  <div class="sys-param-config-container">
    <table-layout>
      <s-table
        ref="configTable"
        :data-request="getConfigList"
        show-pagination
        stripe
        row-key="id"
        border
      >
        <el-table-column
          fixed="left"
          type="selection"
          width="55"
          align="center"
        />
        <el-table-column prop="name" label="参数名称" align="center" />
        <el-table-column
          prop="key"
          width="220"
          show-overflow-tooltip
          label="参数键名"
          align="center"
        />
        <el-table-column
          prop="value"
          width="220"
          show-overflow-tooltip
          label="参数值"
          align="center"
        />
        <el-table-column
          prop="remark"
          show-overflow-tooltip
          label="备注"
          align="center"
        />
        <el-table-column
          prop="createdAt"
          width="180"
          label="创建时间"
          align="center"
        />
        <el-table-column
          prop="updatedAt"
          width="180"
          label="更新时间"
          align="center"
        />
      </s-table>
    </table-layout>
  </div>
</template>

<script>
import TableLayout from '@/layout/components/TableLayout'
import STable from '@/components/Table'

export default {
  name: 'SystemParamConfig',
  components: {
    TableLayout,
    STable
  },
  methods: {
    async getConfigList() {
      return {
        list: [],
        pagaintion: {
          total: 0
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
