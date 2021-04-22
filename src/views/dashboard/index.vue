<template>
  <div class="dashboard-container">
    <el-card shadow="hover">
      <div class="intro-container">
        <h4 :style="{ 'margin-bottom': '40px' }">
          你好，{{ name }}，打工人请开始你的工作吧。
        </h4>
        <h5>
          前端传送门：<el-link
            type="primary"
            href="https://github.com/hackycy/sf-vue-admin"
          >https://github.com/hackycy/sf-vue-admin
            <img src="https://img.shields.io/github/stars/hackycy/sf-vue-admin?style=social"></el-link>
        </h5>
        <h5>
          后端传送门：<el-link
            type="primary"
            href="https://github.com/hackycy/sf-midway-admin/"
          >https://github.com/hackycy/sf-midway-admin/
            <img src="https://img.shields.io/github/stars/hackycy/sf-midway-admin?style=social"></el-link>
        </h5>
        <h6>如果喜欢，不妨点个Star支持一下噢~</h6>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name'])
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 0;
  h4,
  h5 {
    img {
      margin-left: 10px;
      vertical-align: middle;
    }
  }
}
</style>
