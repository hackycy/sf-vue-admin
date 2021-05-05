<template>
  <div class="file-space-container">
    <table-layout :wrap="false">
      <template #header>
        <div class="space-header">
          <el-page-header title="" @back="handleBack" />
          <i v-show="isLoading" class="el-icon-loading" style="margin-right: 10px;" />
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item>根目录</el-breadcrumb-item>
            <el-breadcrumb-item
              v-for="(item, index) in currentPathList"
              :key="index"
            >
              {{ item }}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <el-button size="mini" @click="handleMkdir">创建文件夹</el-button>
          <el-button size="mini" type="primary" @click="handleUpload">上传</el-button>
          <el-button size="mini" type="danger" @click="handleUpload">删除</el-button>
        </div>
      </template>
      <el-table
        ref="fileTable"
        v-infinite-scroll="loadData"
        infinite-scroll-disabled="loadMoreDisabled"
        empty-text="暂无文件"
        height="100%"
        row-key="id"
        :data="fileList"
        size="small"
      >
        <el-table-column show-overflow-tooltip label="文件名">
          <template slot-scope="scope">
            <el-link
              :underline="false"
              @click="handleFileClick(scope.row)"
            ><svg-icon :icon-class="parseType(scope.row.name, scope.row.type)" />{{ scope.row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="putTime"
          show-overflow-tooltip
          label="上传时间"
          align="center"
          width="220"
        />
        <el-table-column
          prop="fsize"
          show-overflow-tooltip
          label="大小"
          align="center"
          width="300"
        >
          <template slot-scope="scope">
            <span>{{ formatSize(scope.row.fsize) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </table-layout>
  </div>
</template>

<script>
import TableLayout from '@/layout/components/TableLayout'
import { getFileList, createDir } from '@/api/file/space'
import { parseMimeTypeToIconName, formatSizeUnits } from '@/utils'
import { isEmpty } from 'lodash'

export default {
  name: 'SystemFileSpace',
  components: {
    TableLayout
  },
  data() {
    return {
      fileList: [],
      currentPathList: [],
      marker: '',
      isLoading: false
    }
  },
  computed: {
    loadMoreDisabled() {
      return isEmpty(this.marker)
    }
  },
  watch: {
    currentPathList: function() {
      this.marker = '' // 目录发生变化时清空marker标志
      this.loadData()
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      if (this.isLoading) {
        return
      }
      try {
        this.isLoading = true
        let path = ''
        if (this.currentPathList.length > 0) {
          path = `${this.currentPathList.join('/')}/`
        }
        const { data } = await getFileList({
          marker: this.marker || '',
          path: path
        })
        if (!isEmpty(this.marker)) {
          // 上次为分页记录下拉去，目录可能会重复，需要去重在进行追加
          const fl = data.list.filter((f) => {
            if (f.type === 'file') {
              return true
            } else {
              return !(this.fileList.find(e => {
                if (e.type === 'file') {
                  return false
                }
                return e.name === f.name
              }))
            }
          })
          if (!isEmpty(fl)) {
            this.fileList.push(...fl)
          }
        } else {
          // 非分页，直接赋值
          this.fileList = data.list || []
        }
        // 记录分页加载标志
        this.marker = data.marker
      } finally {
        // invisible loading
        this.isLoading = false
      }
    },
    handleBack() {
      if (this.currentPathList.length === 0) {
        this.$message('当前已经是根目录啦')
      } else {
        this.currentPathList.pop()
      }
    },
    handleFileClick(row) {
      if (row.type === 'dir') {
        this.currentPathList.push(row.name)
      }
    },
    handleUpload() {

    },
    handleMkdir() {
      this.$openFormDialog({
        title: '创建文件夹',
        formProps: {
          'label-width': '100px'
        },
        on: {
          submit: async(data, { close, done }) => {
            try {
              await createDir(data)
              close()
              // reload
              this.loadData()
            } catch {
              done()
            }
          }
        },
        items: [
          {
            prop: 'dirName',
            label: '文件夹名称',
            rules: {
              required: true,
              trigger: 'blur',
              validator: (rule, value, callback) => {
                // 不可同时存在 // 此种路径
                if (value && !(/([\\/])\1/.test(value)) && !(value.endsWith('/')) && value.startsWith('/')) {
                  callback()
                } else {
                  callback(new Error('请输入合法的文件夹路径'))
                }
              }
            },
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '可创建多级文件夹，以 / 分隔'
              }
            }
          }
        ]
      })
    },
    parseType(fileName, type) {
      if (type === 'dir') {
        return 'file-type-dir'
      }
      return parseMimeTypeToIconName(fileName)
    },
    formatSize(size) {
      if (size) {
        return formatSizeUnits(size)
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.file-space-container {
  position: relative;

  .space-header {
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    align-items: center;

    .breadcrumb {
      flex: 1;
    }
  }

  a {
    svg {
      font-size: 16px;
      margin-left: 5px;
      margin-right: 10px;
    }
  }
}
</style>
