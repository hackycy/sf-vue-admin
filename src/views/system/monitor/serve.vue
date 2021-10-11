<template>
  <div class="sys-server-stat-container">
    服务状态
  </div>
</template>

<script>
export default {
  name: 'SystemMonitorServe'
}
</script>

<style lang="scss" scoped>
.sys-server-stat-container {
  padding: 20px;
  column-count: 2;
  column-gap: 10px;

  .stat-card {
    margin-bottom: 10px;
    break-inside: avoid;
  }
}
</style>
