<template>
  <el-card class="header-item-card" shadow="hover">
    <div class="title">{{ title }}</div>
    <count-to class="value" :start-val="0" :end-val="value" :duration="2000" />
    <span class="suffix">{{ suffix }}</span>
  </el-card>
</template>

<script>
import countTo from 'vue-count-to'

export default {
  name: 'OverviewHeaderItem',
  components: {
    countTo
  },
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    suffix: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.header-item-card {
  flex: 1;
  margin-left: 20px;
  overflow-y: hidden;

  .title {
    font-size: 12px;
    color: #999;
  }

  .value {
    display: inline-block;
    margin: 10px 0;
    height: 40px;
    font-weight: 500;
    font-size: 24px;
    line-height: 40px;
  }

  .suffix {
    display: inline-block;
    font-size: 14px;
    margin-left: 5px;
    color: #6d6d6d;
  }
}
</style>
