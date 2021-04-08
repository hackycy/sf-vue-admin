<template>
  <el-card class="table-layout-container">
    <div v-if="$slots.header" class="table-layout-header">
      <el-row :gutter="gutter" :type="type" :justify="justify" :align="align">
        <slot name="header" />
      </el-row>
    </div>
    <div class="table-layout-content">
      <slot />
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'TableLayout',
  props: {
    gutter: {
      type: Number,
      default: 10
    },
    type: {
      type: String,
      default: 'flex'
    },
    justify: {
      type: String,
      default: 'start'
    },
    align: {
      type: String,
      default: 'top'
    }
  }
}
</script>

<style lang="scss" scoped>
.table-layout-container {
  display: flex;
  display: -webkit-flex;
  background-color: #fff;
  flex-direction: column;

  .table-layout-header {
    margin-bottom: 15px;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;

    .space {
      margin-right: 15px;
    }

  }
}
</style>
