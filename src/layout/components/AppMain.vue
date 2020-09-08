<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin';

.app-main {
  /* 50= navbar  50  */
  // min-height: calc(100vh - 50px);
  height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  // overflow: hidden;
  overflow: auto;
  @include scrollBar;
}

.fixed-header+.app-main {
  padding-top: 50px;
  height: 100%;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    // min-height: calc(100vh - 84px);
    height: calc(100vh - 84px);
    // height: 100%;
  }

  .fixed-header+.app-main {
    padding-top: 84px;
    height: 100%;
  }
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
