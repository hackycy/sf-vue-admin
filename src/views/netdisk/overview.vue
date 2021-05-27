<template>
  <div class="netdisk-overview-container">
    <div v-loading="loading" class="ov-header">
      <overview-header-item
        title="存储总量"
        :value="spaceSize"
        :suffix="spaceUnit"
      />
      <overview-header-item title="文件数量" :value="fileSize" suffix="个" />
      <overview-header-item
        title="下载流量"
        :value="flowSize"
        :suffix="flowUnit"
      />
      <overview-header-item title="GET请求次数" :value="hitSize" suffix="次" />
    </div>
    <div v-loading="loading" class="ov-content">
      <el-card shadow="hover">
        <el-tabs v-model="actionTabName">
          <el-tab-pane label="流量趋势" name="flow">
            <v-chart
              ref="flowChart"
              :options="flowChartOption"
              style="width: 100%; height: 320px;"
              autoresize
            />
          </el-tab-pane>
          <el-tab-pane label="容量趋势" name="space">
            <v-chart
              ref="spaceChart"
              :options="spaceChartOption"
              style="width: 100%; height: 320px;"
              autoresize
            />
          </el-tab-pane>
        </el-tabs>
      </el-card>
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
      loading: false,
      // header
      spaceSize: 0,
      spaceUnit: 'B',
      fileSize: 0,
      flowSize: 0,
      flowUnit: 'B',
      hitSize: 0,
      // content
      actionTabName: 'flow',
      flowChartOption: {
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            return `<div>${params[0].name}号</div><div>${params[0].marker} ${params[0].seriesName}：${params[0].value}MB</div>`
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          data: []
        },
        yAxis: {
          type: 'value',
          boundaryGap: false,
          axisLabel: { formatter: '{value}MB' },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        grid: {
          show: false,
          top: '5%',
          right: '2%',
          left: '5%',
          bottom: '8%'
        },
        series: [
          {
            name: '使用流量',
            data: [],
            type: 'line',
            smooth: 0.6,
            areaStyle: {
              color: '#8cc6f2'
            },
            itemStyle: {
              opacity: 0
            },
            lineStyle: {
              color: '#8cc6f2'
            }
          }
        ]
      },
      spaceChartOption: {
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            return `<div>${params[0].name}号</div><div>${params[0].marker} ${params[0].seriesName}：${params[0].value}MB</div>`
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          },
          data: []
        },
        yAxis: {
          type: 'value',
          boundaryGap: false,
          axisLabel: { formatter: '{value}MB' },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        grid: {
          show: false,
          top: '5%',
          right: '2%',
          left: '5%',
          bottom: '8%'
        },
        series: [
          {
            name: '占用空间',
            data: [],
            type: 'line',
            smooth: 0.6,
            areaStyle: {
              color: '#8cc6f2'
            },
            itemStyle: {
              opacity: 0
            },
            lineStyle: {
              color: '#8cc6f2'
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      try {
        this.showLoading()
        const { data } = await getDesc()
        const sp = formatSizeUnits(data.spaceSize).split(' ')
        this.spaceSize = Number(sp[0])
        this.spaceUnit = sp[1]
        this.fileSize = data.fileSize
        const fs = formatSizeUnits(data.flowSize).split(' ')
        this.flowSize = Number(fs[0])
        this.flowUnit = fs[1]
        this.hitSize = data.hitSize
        // chart
        this.flowChartOption.xAxis.data = data.flowTrend.times
        this.flowChartOption.series[0].data = data.flowTrend.datas.map(e =>
          (e / 1024 / 1024).toFixed()
        )

        this.spaceChartOption.xAxis.data = data.sizeTrend.times
        this.spaceChartOption.series[0].data = data.sizeTrend.datas.map(e =>
          (e / 1024 / 1024).toFixed()
        )
      } finally {
        this.hideLoading()
      }
    },
    showLoading() {
      this.loading = true
    },
    hideLoading() {
      this.loading = false
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

  .ov-content {
    margin: 20px 0;
  }
}
</style>
