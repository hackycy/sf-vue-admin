<template>
  <div>
    <svg-icon icon-class="reload" :class-name="rorate ? 'reload-rorate' : 'reload-revert'" @click="click" />
  </div>
</template>

<script>
export default {
  name: 'ReloadView',
  data() {
    return {
      rorate: false
    }
  },
  methods: {
    click() {
      this.rorate = !this.rorate
      this.$eventBus.emit('reloadView')
    }
  }
}
</script>

<style scoped>
.reload-rorate {
  transform: rotate(-360deg);
  transition: all 1s;
}
.reload-revert {
  transition: all 1s;
}
</style>
