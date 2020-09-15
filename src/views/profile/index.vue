<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="14" :xs="24">
          <el-card>
            <account :user="user" />
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import Account from './components/Account'

export default {
  name: 'Profile',
  components: { Account },
  data() {
    return {
      user: {},
      activeTab: 'activity'
    }
  }
}
</script>
