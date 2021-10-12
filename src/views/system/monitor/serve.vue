<template>
  <div class="sys-server-stat-container">
    <!-- runtime -->
    <el-card class="stat-card">
      <template v-slot:header>
        <span>运行环境</span>
      </template>
      <el-descriptions :column="1" :label-style="{ width: '50%' }">
        <el-descriptions-item label="操作系统">{{
          runtime.os
        }}</el-descriptions-item>
        <el-descriptions-item label="系统架构">{{
          runtime.arch
        }}</el-descriptions-item>
        <el-descriptions-item label="Node版本">
          <el-tag size="small">v{{ runtime.nodeVersion }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="NPM版本">
          <el-tag size="small">v{{ runtime.npmVersion }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <!-- CPU -->
    <el-card class="stat-card">
      <template v-slot:header>
        <span>CPU</span>
      </template>
      <el-descriptions :column="1" :label-style="{ width: '50%' }" :content-style="{ width: '50%' }">
        <el-descriptions-item label="详细">{{
          parseCpuInfo
        }}</el-descriptions-item>
        <el-descriptions-item label="总使用率">
          <el-progress :percentage="formarPercentage(cpu.rawCurrentLoad, cpu.rawCurrentLoadIdle + cpu.rawCurrentLoad)" :color="custonProgressColor" />
        </el-descriptions-item>
        <el-descriptions-item v-for="(item, index) in cpu.coresLoad" :key="index" :label="`核心${index + 1} 使用率`">
          <el-progress :percentage="formarPercentage(item.rawLoad, item.rawLoad + item.rawLoadIdle)" :color="custonProgressColor" />
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <!-- disk -->
    <el-card class="stat-card">
      <template v-slot:header>
        <span>磁盘</span>
      </template>
      <div class="disk-info">
        <el-descriptions class="disk-info--item" :column="1">
          <el-descriptions-item label="总空间">{{
            formatDiskUnit.size
          }}</el-descriptions-item>
          <el-descriptions-item label="已用空间">{{
            formatDiskUnit.used
          }}</el-descriptions-item>
          <el-descriptions-item label="可用空间">{{
            formatDiskUnit.available
          }}</el-descriptions-item>
        </el-descriptions>
        <div class="disk-info--item">
          <el-progress
            type="dashboard"
            :percentage="parseDiskPercentage"
            :width="100"
            :color="custonProgressColor"
          />
        </div>
      </div>
    </el-card>
    <!-- memoty -->
    <el-card class="stat-card">
      <template v-slot:header>
        <span>内存</span>
      </template>
      <div class="disk-info">
        <el-descriptions class="disk-info--item" :column="1">
          <el-descriptions-item label="总内存">{{
            formatMemoryUnit.total
          }}</el-descriptions-item>
          <el-descriptions-item label="已用内存">{{
            formatMemoryUnit.used
          }}</el-descriptions-item>
          <el-descriptions-item label="可用内存">{{
            formatMemoryUnit.free
          }}</el-descriptions-item>
        </el-descriptions>
        <div class="disk-info--item">
          <el-progress
            type="dashboard"
            :percentage="parseMemoryPercentage"
            :width="100"
            :color="custonProgressColor"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getServeStat } from '@/api/sys/serve'
import { formatSizeUnits } from '@/utils'

export default {
  name: 'SystemMonitorServe',
  data() {
    return {
      intervalId: -1,
      runtime: {
        os: '',
        arch: '',
        nodeVersion: '',
        npmVersion: ''
      },
      disk: {
        size: 0,
        used: 0,
        available: 0
      },
      memory: {
        total: 0,
        free: 0,
        used: 0
      },
      cpu: {
        // Intel(R) Xeon(R) Platinum 8163 CPU @ 2.50GHz
        manufacturer: '',
        brand: '',
        physicalCores: 0,
        model: '',
        speed: 0,
        speedMax: 0,
        rawCurrentLoad: 0,
        rawCurrentLoadIdle: 0,
        coresLoad: []
      }
    }
  },
  computed: {
    formatDiskUnit() {
      return {
        size: formatSizeUnits(this.disk.size),
        used: formatSizeUnits(this.disk.used),
        available: formatSizeUnits(this.disk.available)
      }
    },
    formatMemoryUnit() {
      return {
        total: formatSizeUnits(this.memory.total),
        free: formatSizeUnits(this.memory.free),
        used: formatSizeUnits(this.memory.used)
      }
    },
    parseDiskPercentage() {
      if (this.disk.size <= 0) {
        return 0
      }
      return Math.floor((this.disk.used / this.disk.size) * 100)
    },
    parseMemoryPercentage() {
      if (this.memory.total <= 0) {
        return 0
      }
      return Math.floor((this.memory.used / this.memory.total) * 100)
    },
    parseCpuInfo() {
      return `${this.cpu.manufacturer} ${this.cpu.brand} @ ${this.cpu.speed}GHz  ${this.cpu.speedMax}Ghz`
    }
  },
  created() {
    this.refresh()
  },
  mounted() {
    // 10秒自动刷新
    this.intervalId = setInterval(this.refresh, 10000)
  },
  destroyed() {
    clearInterval(this.intervalId)
  },
  methods: {
    async refresh() {
      const { data } = await getServeStat()
      this.runtime = data.runtime
      this.disk = data.disk
      this.memory = data.memory
      this.cpu = data.cpu
    },
    custonProgressColor(percentage) {
      if (percentage < 30) {
        return '#5cb87a'
      } else if (percentage < 70) {
        return '#e6a23c'
      } else {
        return '#f53f3f'
      }
    },
    formarPercentage(used, total) {
      if (total <= 0) {
        return 0
      }
      return Math.floor((used / total) * 100)
    }
  }
}
</script>

<style lang="scss" scoped>
.sys-server-stat-container {
  padding: 20px;
  column-count: 2;
  column-gap: 10px;

  .stat-card {
    margin-bottom: 10px;
    break-inside: avoid;
    transform: translateZ(0);

    .disk-info {
      width: 100%;
      display: flex;
      flex-direction: row;

      &--item {
        width: 50%;
      }
    }
  }
}
</style>
