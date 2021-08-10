<template>
  <div class="account-about-container">
    <div class="header-container">
      <div class="title">
        <b>关于</b>
      </div>
      sf-admin 是一个为后台项目开发提供现成的开箱解决方案，原则上不会限制任何代码用于商用。
    </div>
    <el-card class="m-20">
      <div slot="header">
        <b>项目信息</b>
      </div>
      <el-descriptions :column="2" size="small" border>
        <el-descriptions-item>
          <template slot="label">
            版本
          </template>
          <el-tag size="small">{{ info.pkg.version }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            最后编译时间
          </template>
          <el-tag size="small">{{ info.lastBuildTime }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            文档地址
          </template>
          <el-link href="https://blog.si-yee.com/sf-admin-cli" target="_blank" :underline="false">文档地址</el-link>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            预览地址
          </template>
          <el-link href="http://opensource.admin.si-yee.com/" target="_blank" :underline="false">预览地址</el-link>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            Github
          </template>
          <el-link href="https://github.com/hackycy/sf-nest-admin" target="_blank" :underline="false">Nest版</el-link> 、
          <el-link href="https://github.com/hackycy/sf-midway-admin" target="_blank" :underline="false">Midway版</el-link>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card class="m-20">
      <div slot="header">
        <b>生产环境依赖</b>
      </div>
      <el-descriptions :column="2" size="small" border>
        <el-descriptions-item v-for="(v, k) in info.pkg.dependencies" :key="k">
          <template slot="label">
            {{ k }}
          </template>
          {{ v }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-card class="m-20">
      <div slot="header">
        <b>开发环境依赖</b>
      </div>
      <el-descriptions :column="2" size="small" border>
        <el-descriptions-item v-for="(v, k) in info.pkg.devDependencies" :key="k">
          <template slot="label">
            {{ k }}
          </template>
          {{ v }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AccountSettings',
  data() {
    return {
      info: Object.freeze(JSON.parse(process.env.VUE_APP_SFADMIN_INFO))
    }
  }
}
</script>

<style lang="scss" scoped>
.account-about-container {
  font-size: 14px;

  .m-20 {
    margin-bottom: 20px;
    margin-left: 20px;
    margin-right: 20px;
  }

  .header-container {
    background-color: white;
    padding: 20px;
    margin-bottom: 20px;

    .title {
      font-size: 20px;
      margin-bottom: 10px;
    }
  }
}
</style>
