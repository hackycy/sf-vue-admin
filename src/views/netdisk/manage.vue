<template>
  <div class="file-space-container">
    <table-layout :wrap="false">
      <template #header>
        <div class="space-header">
          <i :class="isLoading ? 'el-icon-loading' : 'el-icon-folder'" style="margin-right: 16px;margin-left: 16px;" />
          <!-- 目录列表 -->
          <div class="breadcrumb">
            <el-breadcrumb v-show="!isSearching" separator="/">
              <el-breadcrumb-item><el-link :underline="false" @click="handleJumpPath(-1)">根目录</el-link></el-breadcrumb-item>
              <el-breadcrumb-item
                v-for="(item, index) in currentPathList"
                :key="index"
              >
                <el-link :underline="false" @click="handleJumpPath(index, item)">{{ item }}</el-link>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <!-- 按钮操作栏 -->
          <file-operate-button-list
            :search-key.sync="localSearchKey"
            :selected-file-list="selectedFileList"
            :parse-path="parsePath"
            @changed="refresh"
          />
        </div>
      </template>
      <!-- file table -->
      <el-table
        :key="tableKey"
        ref="fileTable"
        v-el-table-infinite-scroll="loadData"
        infinite-scroll-distance="10"
        infinite-scroll-disabled="loadMoreDisabled"
        empty-text="暂无文件"
        height="100%"
        row-key="id"
        :data="fileList"
        size="small"
        @row-contextmenu="handleRowContextMenu"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          type="selection"
          width="50"
        />
        <el-table-column show-overflow-tooltip label="文件名">
          <template slot-scope="scope">
            <el-link
              :disabled="scope.row.type === 'file' && !$auth('netdiskManage.info')"
              :underline="false"
              @click="handleClickFileItem(scope.row)"
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
        <el-table-column
          v-if="isSearching"
          prop="belongTo"
          show-overflow-tooltip
          label="所属目录"
          align="center"
          width="220"
        >
          <template slot-scope="scope">
            <el-link
              :disabled="scope.row.type === 'file' && !$auth('netdiskManage.info')"
              :underline="false"
              type="info"
              @click="handleClickBelong(scope.row)"
            >
              {{ scope.row.belongTo ? scope.row.belongTo : '根目录' }}
            </el-link>
          </template>
        </el-table-column>
        <template v-if="!loadMoreDisabled" slot="append">
          <el-row type="flex" justify="center">
            <span style="line-height: 50px;">
              <i class="el-icon-loading" style="font-size: 16px; margin-right: 10px;" />
              <span style="font-size: 14px;">加载中...</span>
            </span>
          </el-row>
        </template>
      </el-table>
    </table-layout>
    <file-preview-drawer ref="previewDrawer" />
  </div>
</template>

<script>
import TableLayout from '@/layout/components/TableLayout'
import FileOperateButtonList from './components/file-operate-button-list'
import FilePreviewDrawer from './components/file-preview-drawer'
import PollingMixin from './mixins/polling'
import { getFileList, renameDirOrFile, getDownloadLink } from '@/api/netdisk/manage'
import { parseMimeTypeToIconName, formatSizeUnits } from '@/utils'
import { isEmpty } from 'lodash'

export default {
  name: 'SystemFileSpace',
  components: {
    TableLayout,
    FilePreviewDrawer,
    FileOperateButtonList
  },
  mixins: [PollingMixin],
  data() {
    return {
      fileList: [],
      currentPathList: [],
      marker: '',
      localSearchKey: '',
      // item must a obj like this : { type: 'file' , name: 'xxx.jpg' }
      selectedFileList: [],
      // 菊花加载
      isLoading: false,
      tableKey: 1,
      // 防止滚动加载速度过快导致出现数据不同步
      lock: false
    }
  },
  computed: {
    loadMoreDisabled() {
      return isEmpty(this.marker)
    },
    isSearching() {
      return !isEmpty(this.localSearchKey)
    }
  },
  watch: {
    currentPathList: function() {
      // clear key
      this.refresh()
    },
    localSearchKey: function(k) {
      this.refresh()
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    refresh() {
      this.marker = ' '
      this.fileList = []
      this.selectedFileList = []
      // unlock
      if (this.lock) {
        this.lock = false
      }
      // 让el-table重新渲染，否则滚动在重置数据时候数据过少不会触发滚动加载
      this.tableKey += 1
    },
    async loadData() {
      if (this.lock) {
        return
      }
      this.lock = true
      const path = this.parsePath()
      const { data } = await getFileList({
        marker: this.marker.trim() || '',
        path: path,
        key: this.localSearchKey
      })
      if (!isEmpty(this.marker)) {
        // 上次有分页记录时，目录可能会重复，需要去重在进行追加
        const fl = data.list.filter(f => {
          if (f.type === 'file') {
            return true
          } else {
            return !this.fileList.find(e => {
              if (e.type === 'file') {
                return false
              }
              return e.name === f.name
            })
          }
        })
        if (!isEmpty(fl)) {
          this.fileList.push(...fl)
        } else {
          // 重复分页只有目录时没有数据滚动，则会导致分页无法正常加载
          // this.fileList = cloneDeep(this.fileList)
          this.tableKey += 1
        }
      } else {
        // 非分页，直接赋值
        this.fileList = data.list || []
      }
      // 记录分页加载标志
      this.marker = data.marker
      this.lock = false
    },
    handleJumpPath(index) {
      if (this.isSearching) {
        return
      }
      if (index === -1 && this.currentPathList.length > 0) {
        this.currentPathList = []
      } else if (index >= 0 && this.currentPathList.length - 1 !== index) {
        this.currentPathList = this.currentPathList.slice(0, index + 1)
      }
    },
    handleClickBelong(row) {
      // clear search key
      this.localSearchKey = ''
      if (isEmpty(row.belongTo)) {
        // root
        this.currentPathList = []
      } else {
        this.currentPathList = row.belongTo.split('/')
      }
    },
    handleClickFileItem(row) {
      if (row.type === 'dir') {
        if (this.isSearching) {
          const pathList = isEmpty(row.belongTo) ? [] : pathList.split('/')
          pathList.push(row.name)
          // clear search key
          this.localSearchKey = ''
          this.currentPathList = pathList
        } else {
          this.currentPathList.push(row.name)
        }
      } else {
        if (this.isSearching) {
          this.$refs.previewDrawer.open(row.name, isEmpty(row.belongTo) ? '' : `${row.belongTo}/`)
        } else {
          this.$refs.previewDrawer.open(row.name, this.parsePath())
        }
      }
    },
    async handleDownload(row) {
      try {
        this.isLoading = true
        const { data } = await getDownloadLink({
          path: this.parsePath(),
          name: row.name
        })
        // handle
        window.open(`${data}?attname=${encodeURIComponent(row.name)}`)
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
                    this.refresh()
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
                this.refresh()
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
            title: '重命名',
            disabled: !this.$auth('netdiskManage.rename'),
            callback: ({ close }) => {
              close()
              this.handleRename(row)
            }
          }
        ]
      })
    },
    handleSelectionChange(rows) {
      this.selectedFileList = rows.map((item) => { return { type: item.type, name: item.name } })
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
