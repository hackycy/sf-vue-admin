<template>
  <div class="netdisk-overview-container">
    <div class="ov-header">
      <overview-header-item title="已存储量" :value="spaceSize" :suffix="spaceUnit" />
      <overview-header-item title="文件数量" :value="fileSize" suffix="个" />
      <overview-header-item title="下载流量" :value="flowSize" :suffix="flowUnit" />
      <overview-header-item title="GET请求次数" :value="hitSize" suffix="次" />
    </div>
  </div>
</template>

<script>
import OverviewHeaderItem from './components/overview-header-item'
import { getDesc } from '@/api/netdisk/overview'
import { formatSizeUnits } from '@/utils'

export default {
  name: 'NetDiskOverview',
  components: {
    OverviewHeaderItem
  },
  data() {
    return {
      // header
      spaceSize: 0,
      spaceUnit: 'B',
      fileSize: 0,
      flowSize: 0,
      flowUnit: 'B',
      hitSize: 0
    }
  },
  created() {
    this.initHeaderData()
  },
  methods: {
    async initHeaderData() {
      const { data } = await getDesc()
      const sp = formatSizeUnits(data.spaceSize).split(' ')
      this.spaceSize = sp[0]
      this.spaceUnit = sp[1]
      this.fileSize = data.fileSize
      const fs = formatSizeUnits(data.flowSize).split(' ')
      this.flowSize = fs[0]
      this.flowUnit = fs[1]
      this.hitSize = data.hitSize
    }
  }
}
</script>

<style lang="scss" scoped>
.netdisk-overview-container {
  margin: 20px;

  .ov-header {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    margin-left: -20px;
  }
}
</style>
