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
          <el-button type="primary" size="mini" :disabled="!$auth('netdiskManage.token')" @click="handleUpload"><i class="el-icon-upload" />上传文件</el-button>
          <el-button size="mini" :disabled="!$auth('netdiskManage.mkdir')" @click="handleMkdir"><i class="el-icon-folder-add" />创建文件夹</el-button>
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
        @row-contextmenu="handleRowContextMenu"
        @header-contextmenu="handleHeaderContextMenu"
      >
        <el-table-column show-overflow-tooltip label="文件名">
          <template slot-scope="scope">
            <el-link
              :underline="false"
              @click="handleFileClick(scope.row)"
            ><svg-icon :icon-class="parseType(scope.row.name, scope.row.type)" />
              <span v-if="isSearching" v-html="hignlightSearchKey(scope.row.name)" />
              <span v-else>{{ scope.row.name }}</span>
            </el-link>
          </template>
        </el-table-column>
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
        <el-table-column
          prop="putTime"
          show-overflow-tooltip
          label="上传时间"
          align="center"
          width="220"
        />
      </el-table>
    </table-layout>
    <file-upload-dialog ref="uploadDialog" @closed="loadData" />
  </div>
</template>

<script>
import TableLayout from '@/layout/components/TableLayout'
import FileUploadDialog from './components/file-upload-dialog'
import MessageBoxMixin from '@/core/mixins/message-box'
import { getFileList, createDir, renameDirOrFile, getDownloadLink, deleteFileOrDir, checkTaskStatus } from '@/api/netdisk/manage'
import { parseMimeTypeToIconName, formatSizeUnits } from '@/utils'
import { isEmpty } from 'lodash'

export default {
  name: 'SystemFileSpace',
  components: {
    TableLayout,
    FileUploadDialog
  },
  mixins: [MessageBoxMixin],
  data() {
    return {
      fileList: [],
      currentPathList: [],
      marker: '',
      localSearchKey: '',
      // cur & copy 两者对立，不能存在两个都为true
      cutMode: false,
      copyMode: false,
      pasteOriginPath: '',
      // 菊花加载
      isLoading: false
    }
  },
  computed: {
    isSearching() {
      return !isEmpty(this.localSearchKey)
    },
    loadMoreDisabled() {
      return isEmpty(this.marker)
    },
    backDisabled() {
      return this.currentPathList.length === 0
    },
    pasteDisabled() {
      return !this.cutMode && !this.copyMode
    }
  },
  watch: {
    cutMode: function(mode) {
      if (mode) {
        this.copyMode = false
        // record current path
        this.pasteOriginPath = this.parsePath()
      }
    },
    copyMode: function(mode) {
      if (mode) {
        this.cutMode = false
        // record current path
        this.pasteOriginPath = this.parsePath()
      }
    },
    currentPathList: function() {
      this.marker = '' // 目录发生变化时清空marker标志
      this.loadData()
    },
    localSearchKey: function(k) {
      if (isEmpty(k)) {
        this.marker = ''
        this.loadData()
      }
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
          path: path,
          key: this.localSearchKey
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
      if (row.type === 'dir' && !this.isLoading) {
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
    async handleDelete(row, { close, done }) {
      try {
        const path = this.parsePath()
        await deleteFileOrDir({
          path,
          name: row.name,
          type: row.type
        })
        if (row.type === 'dir') {
          this.pollingCheckStatus('delete', row.name, path, {
            success: () => {
              this.$message.success('已删除该文件夹')
              this.loadData()
            },
            fail: (e) => {
              this.$notify.error({
                title: '删除文件夹失败',
                message: e,
                duration: 3000
              })
            }
          })
        } else {
          this.$message.success('已删除该文件')
          this.loadData()
        }
        done()
        close()
      } catch {
        done()
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
              const path = this.parsePath()
              await renameDirOrFile({
                type: row.type,
                toName: data.toName,
                name: row.name,
                path
              })
              // reload
              if (row.type === 'dir') {
                this.pollingCheckStatus('delete', row.name, path, {
                  success: () => {
                    this.$message.success('重命名文件夹成功')
                    this.loadData()
                  },
                  fail: (e) => {
                    this.$notify.error({
                      title: '重命名文件夹失败',
                      message: e,
                      duration: 3000
                    })
                  }
                })
                close()
              } else {
                close()
                this.loadData()
              }
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
    handleLocalSearch() {
      this.$openFormDialog({
        title: '搜索当前文件夹',
        formProps: {
          'label-width': '80px'
        },
        on: {
          submit: (data, { close }) => {
            this.localSearchKey = data.key
            this.marker = ''
            this.loadData()
            close()
          }
        },
        items: [
          {
            prop: 'key',
            label: '关键字',
            value: '',
            rules: {
              required: true,
              trigger: 'blur',
              validator: (rule, value, callback) => {
                // 不可同时存在 // 此种路径
                if (value && !value.includes('/')) {
                  callback()
                } else {
                  callback(new Error('请输入合法的名称'))
                }
              }
            },
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入搜索关键字'
              }
            }
          }
        ]
      })
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
              await createDir({
                path: this.parsePath(),
                dirName: data.dirName
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
            prop: 'dirName',
            label: '文件夹名称',
            rules: {
              required: true,
              trigger: 'blur',
              validator: (rule, value, callback) => {
                // 不可同时存在 // 此种路径
                if (value && !(value.includes('/'))) {
                  callback()
                } else {
                  callback(new Error('请输入合法的文件夹路径'))
                }
              }
            },
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入文件夹名称'
              }
            }
          }
        ]
      })
    },
    handleHeaderContextMenu(column, e) {
      this.$openContextMenu(e, {
        width: 100,
        items: [
          {
            title: '刷新',
            callback: ({ close }) => {
              close()
              this.marker = ''
              this.loadData()
            }
          },
          {
            title: this.isSearching ? '取消搜索' : '搜索',
            disabled: !this.$auth('netdiskManage.list'),
            callback: ({ close }) => {
              close()
              this.isSearching ? this.localSearchKey = '' : this.handleLocalSearch()
            }
          }
        ]
      })
    },
    /**
     * 行右键打开右键菜单
     */
    handleRowContextMenu(row, column, e) {
      this.$openContextMenu(e, {
        width: 100,
        items: [
          {
            title: '下载',
            disabled: row.type === 'dir' || !this.$auth('netdiskManage.download'),
            callback: ({ close }) => {
              close()
              this.handleDownload(row)
            }
          },
          {
            title: '剪切',
            disabled: !this.$auth('netdiskManage.cut'),
            callback: ({ close }) => {
              close()
            }
          },
          {
            title: '复制',
            disabled: !this.$auth('netdiskManage.copy'),
            callback: ({ close }) => {
              close()
            }
          },
          {
            title: '粘贴',
            disabled: this.pasteDisabled,
            callback: ({ close }) => {
              close()
            }
          },
          {
            title: '重命名',
            disabled: !this.$auth('netdiskManage.rename'),
            callback: ({ close }) => {
              close()
              this.handleRename(row)
            }
          },
          {
            title: '删除',
            disabled: !this.$auth('netdiskManage.delete'),
            callback: ({ close }) => {
              close()
              this.openLoadingConfirm({ on: {
                confirm: (op) => {
                  this.handleDelete(row, op)
                }
              }})
            }
          }
        ]
      })
    },
    /**
     * 每三秒轮训任务状态
     */
    pollingCheckStatus(action, name, path, { success, fail }) {
      this.$message.success('已加入后台任务，请勿重复操作')
      const val = setInterval(async() => {
        try {
          const { data } = await checkTaskStatus({
            action,
            name: name,
            path
          })
          if (data.status === 1) {
            if (success) {
              success()
            }
          } else if (data.status === 2) {
            if (fail) {
              fail(data.err)
            }
          }
          clearInterval(val)
        } catch {
          clearInterval(val)
        }
      }, 3000)
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
      return '-'
    },
    hignlightSearchKey(name) {
      return name.replace(new RegExp(`${this.localSearchKey}`, 'g'), `<span style='color: red;'>${this.localSearchKey}</span>`)
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
