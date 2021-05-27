<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view v-if="reloadFlag" :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      reloadFlag: true
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  },
  mounted() {
    this.$eventBus.on('reloadView', this.reload)
  },
  methods: {
    reload() {
      this.reloadFlag = false
      this.$nextTick(() => {
        this.reloadFlag = true
      })
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px - 34px);
  width: 100%;
  position: relative;
  overflow: hidden;

  /* basic */
  background-color: #eff2f5;
}
.fixed-header+.app-main {
  /* support main has padding 20px  */
  padding-top: calc(50px + 20px + 34px);
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
