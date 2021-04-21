<template>
  <div class="account-settings-container">
    <el-card>
      <el-tabs tab-position="left">
        <el-tab-pane label="基本设置"><account-basic-setting /></el-tab-pane>
        <el-tab-pane label="安全设置">配置管理</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import AccountBasicSetting from './components/basic'

export default {
  name: 'AccountSettings',
  components: {
    AccountBasicSetting
  }
}
</script>
