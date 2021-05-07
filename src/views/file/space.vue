<template>
  <div class="file-space-container">
    <table-layout :wrap="false">
      <template #header>
        <div class="space-header">
          <el-button icon="el-icon-back" size="mini" :disabled="backDisabled" @click="handleBack" />
          <i :class="isLoading ? 'el-icon-loading' : 'el-icon-folder-checked'" style="margin-right: 14px;margin-left: 14px" />
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item><el-link :underline="false" @click="handleJumpPath(-1)">根目录</el-link></el-breadcrumb-item>
            <el-breadcrumb-item
              v-for="(item, index) in currentPathList"
              :key="index"
            >
              <el-link :underline="false" @click="handleJumpPath(index, item)">{{ item }}</el-link>
            </el-breadcrumb-item>
          </el-breadcrumb>
          <el-button type="primary" size="mini" :disabled="!$auth('fileSpace.token')" @click="handleUpload"><i class="el-icon-upload" />上传文件</el-button>
          <el-button size="mini" :disabled="!$auth('fileSpace.mkdir')" @click="handleMkdir"><i class="el-icon-folder-add" />创建文件夹</el-button>
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
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ formatSize(scope.row.fsize) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :disabled="scope.row.type === 'dir' || !$auth('fileSpace.download')"
              @click="handleDownload(scope.row)"
            >下载</el-button>
            <el-button
              size="mini"
              type="success"
              :disabled="!$auth('fileSpace.rename')"
              @click="handleRename(scope.row)"
            >重命名</el-button>
            <el-button
              size="mini"
              type="danger"
              :disabled="!$auth('fileSpace.delete')"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </table-layout>
    <file-upload-dialog ref="uploadDialog" @closed="loadData" />
  </div>
</template>

<script>
import TableLayout from '@/layout/components/TableLayout'
import FileUploadDialog from './components/file-upload-dialog'
import { getFileList, createDir, renameDirOrFile, getDownloadLink } from '@/api/file/space'
import { parseMimeTypeToIconName, formatSizeUnits } from '@/utils'
import { isEmpty } from 'lodash'

export default {
  name: 'SystemFileSpace',
  components: {
    TableLayout,
    FileUploadDialog
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
    },
    backDisabled() {
      return this.currentPathList.length === 0
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
        const path = this.parsePath()
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
    handleJumpPath(index) {
      if (index === -1 && this.currentPathList.length > 0) {
        this.currentPathList = []
      } else if (index >= 0 && this.currentPathList.length - 1 !== index) {
        this.currentPathList = this.currentPathList.slice(0, index + 1)
      }
    },
    handleFileClick(row) {
      if (row.type === 'dir') {
        this.currentPathList.push(row.name)
      }
    },
    handleUpload() {
      this.$refs.uploadDialog.open(this.parsePath())
    },
    async handleDownload(row) {
      try {
        this.isLoading = true
        const { data } = await getDownloadLink({
          path: this.parsePath(),
          name: row.name
        })
        // handle
        window.open(data)
      } finally {
        this.isLoading = false
      }
    },
    handleRename(row) {
      this.$openFormDialog({
        title: '重命名',
        formProps: {
          'label-width': '100px'
        },
        on: {
          submit: async(data, { close, done }) => {
            try {
              await renameDirOrFile({
                type: row.type,
                toName: data.toName,
                name: row.name,
                path: this.parsePath()
              })
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
            prop: 'toName',
            label: `${row.type === 'dir' ? '文件夹' : '文件'}名称`,
            value: row.name,
            rules: {
              required: true,
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (value && value === row.name) {
                  callback(new Error('修改前后名称一致'))
                } else if (value && !value.includes('/')) {
                  callback()
                } else {
                  callback(new Error(`请输入合法${row.type === 'dir' ? '文件夹' : '文件'}的名称`))
                }
              }
            },
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '输入重命名后的名称'
              }
            }
          }
        ]
      })
    },
    handleDelete() {},
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
                if (value && !(/([\\/])\1/.test(value)) && !value.endsWith('/') && !value.startsWith('/')) {
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
    parsePath() {
      let path = ''
      if (this.currentPathList.length > 0) {
        path = `${this.currentPathList.join('/')}/`
      }
      return path
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

    i {
      margin-right: 5px;
    }

    .breadcrumb {
      flex: 1;

      a {
        vertical-align: baseline !important;
      }
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
