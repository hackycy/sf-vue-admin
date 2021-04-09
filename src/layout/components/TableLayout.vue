<template>
  <el-card class="table-layout-container" :class="{ 'fixed-height': !wrap }">
    <el-container>
      <el-aside v-if="$slots.asside" :width="assideWidth">
        <slot name="asside" />
      </el-aside>
      <el-container>
        <el-main>
          <div v-if="$slots.header" class="table-layout-header">
            <el-row
              :gutter="gutter"
              :type="type"
              :justify="justify"
              :align="align"
            >
              <slot name="header" />
            </el-row>
          </div>
          <div class="table-layout-content">
            <slot />
          </div>
        </el-main>
      </el-container>
    </el-container>
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
    },
    assideWidth: {
      type: String,
      default: '200px'
    },
    wrap: {
      type: Boolean,
      default: true
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

  // 重置main padding
  // overflow：auto 可解决flex-direction: row 子宽度超出问题
  .el-main {
    padding: 0;
  }

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
.fixed-height {
  /* padding top + bottom = 40px + NavBar 50px */
  height: calc(100vh - 40px - 50px);

  .el-container {
    height: 100%;
  }
}
</style>
