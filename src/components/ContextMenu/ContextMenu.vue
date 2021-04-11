<template>
  <div v-show="visible" class="s-context-menu" :style="{ left: style.left + 'px', top: style.top + 'px' }">
    <div v-for="(o, i) in items" :key="i" class="item">
      <span>{{ o.title }}</span>
      <i v-if="o.icon" :class="o.icon" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SContextMenu',
  data() {
    return {
      visible: false,
      style: {
        left: 0,
        top: 0
      },
      on: {
        rowClick: null
      },
      items: []
    }
  },
  mounted() {
    window.addEventListener('resize', this.close)
  },
  methods: {
    show(event, options) {},
    close() {}
  }
}
</script>

<style lang="scss" scoped>
.s-context-menu {
  position: absolute;
  z-index: 99999;

  .context-menu-box {
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    width: 160px;
    padding: 5px 0;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 0;

    .item {
      display: flex;
      align-items: center;
      height: 35px;
      font-size: 13px;
      cursor: pointer;
      padding: 0 15px;
      color: #666;
      position: relative;

      span {
        height: 35px;
        line-height: 35px;
        flex: 1;
      }
    }
  }
}
</style>
