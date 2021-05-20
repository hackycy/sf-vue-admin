<template>
  <span class="netdisk-file-operate-container">
    <!-- 按钮操作栏 -->
    <el-button
      v-show="copyMode || cutMode"
      type="info"
      plain
      size="mini"
      :disabled="disabledPasteButton"
      @click="handlePaste"
    ><i class="el-icon-s-claim" />粘贴</el-button>
    <el-dropdown size="small" @command="handleMoreOpCommand">
      <el-tooltip
        effect="dark"
        content="注意：复制或剪切时会覆盖重名文件"
        placement="top"
      >
        <el-button :disabled="disabledMultiOperateButton" type="warning" size="mini" style="margin: 0 10px;">
          <i class="el-icon-s-operation" />批量操作
        </el-button>
      </el-tooltip>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          icon="el-icon-document-copy"
          command="copy"
          :disabled="!$auth('netdiskManage.copy')"
        >
          复制所选
        </el-dropdown-item>
        <el-dropdown-item
          icon="el-icon-scissors"
          command="cut"
          :disabled="!$auth('netdiskManage.cut')"
        >
          剪切所选
        </el-dropdown-item>
        <el-dropdown-item
          icon="el-icon-folder-remove"
          command="delete"
          :disabled="!$auth('netdiskManage.delete')"
        >
          删除所选
        </el-dropdown-item>
        <el-dropdown-item
          icon="el-icon-close"
          divider
          command="cancel"
          :disabled="!copyMode && !cutMode"
        >
          取消粘贴
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-button
      :plain="isSearching"
      type="success"
      size="mini"
      :disabled="!$auth('netdiskManage.list')"
      @click="handleSearch"
    ><i class="el-icon-search" />
      {{ isSearching ? '取消搜索' : '全盘搜索' }}
    </el-button>
    <el-button
      type="primary"
      size="mini"
      :disabled="!$auth('netdiskManage.token')"
      @click="handleUpload"
    ><i class="el-icon-upload" />上传文件</el-button>
    <el-button
      size="mini"
      :disabled="!$auth('netdiskManage.mkdir')"
      @click="handleMkdir"
    ><i class="el-icon-folder-add" />创建文件夹</el-button>
    <file-upload-drawer ref="uploadDrawer" @changed="$emit('changed')" />
  </span>
</template>

<script>
import { createDir, deleteFileOrDir, cutFiles, copyFiles } from '@/api/netdisk/manage'
import FileUploadDrawer from './file-upload-drawer'
import MessageBoxMixin from '@/core/mixins/message-box'
import PollingMixin from '../mixins/polling'
import { clone, isEmpty } from 'lodash'

export default {
  name: 'FileOperateButtonList',
  components: {
    FileUploadDrawer
  },
  mixins: [MessageBoxMixin, PollingMixin],
  props: {
    selectedFileList: {
      type: Array,
      required: true
    },
    parsePath: {
      type: Function,
      required: true
    },
    searchKey: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // cur & copy 两者对立，不能存在两个都为true
      cutMode: false,
      copyMode: false,
      pasteOriginPath: '',
      pasteFileList: []
    }
  },
  computed: {
    disabledMultiOperateButton() {
      if (this.pasteFileList.length > 0) {
        // need paste
        return false
      }
      return this.selectedFileList.length <= 0
    },
    disabledPasteButton() {
      return this.cutMode && this.pasteOriginPath === this.parsePath()
    },
    isSearching() {
      return !isEmpty(this.searchKey)
    }
  },
  watch: {
    cutMode: function(mode) {
      if (mode) {
        this.copyMode && (this.copyMode = false)
        this.recordFileList()
      }
    },
    copyMode: function(mode) {
      if (mode) {
        this.cutMode && (this.cutMode = false)
        this.recordFileList()
      }
    }
  },
  methods: {
    handleMoreOpCommand(command) {
      if (command === 'copy') {
        this.copyMode = true
      } else if (command === 'cut') {
        this.cutMode = true
      } else if (command === 'delete') {
        // delete
        this.openLoadingConfirm({ on: {
          confirm: (op) => {
            this.handleDelete(op)
          }
        }})
      } else if (command === 'cancel') {
        this.cutMode = false
        this.copyMode = false
        this.clearPasteCache()
      }
    },
    recordFileList() {
      this.pasteFileList = clone(this.selectedFileList)
      this.pasteOriginPath = this.parsePath()
    },
    clearPasteCache() {
      this.pasteOriginPath = ''
      this.pasteFileList = []
    },
    async handlePaste() {
      try {
        const opData = {
          files: this.pasteFileList,
          originPath: this.pasteOriginPath,
          toPath: this.parsePath()
        }
        if (this.cutMode && !this.copyMode) {
          // cut
          await cutFiles(opData)
          this.cutMode = false
        } else if (!this.cutMode && this.copyMode) {
          // copy
          await copyFiles(opData)
          this.copyMode = false
        }
        this.clearPasteCache()
        if (opData.files.length === 1 && opData.files[0].type === 'file') {
          this.$emit('changed')
        } else {
          this.pollingCheckStatus('copy', opData.originPath, opData.toPath, {
            success: () => {
              this.$message.success('复制成功')
              this.$emit('changed')
            },
            fail: (e) => {
              this.$notify.error({
                title: '复制失败',
                message: e,
                duration: 3000
              })
            }
          })
        }
      } catch (e) {
        // nothing to do
      }
    },

    async handleDelete({ close, done }) {
      try {
        const path = this.parsePath()
        const files = clone(this.selectedFileList)
        await deleteFileOrDir({
          path,
          files
        })
        if (files.length === 1 && files[0] === 'file') {
          this.$message.success('已删除该文件')
          this.$emit('changed')
        } else {
          this.pollingCheckStatus('delete', '', path, {
            success: () => {
              this.$message.success('已删除所选列表')
              this.$emit('changed')
            },
            fail: (e) => {
              this.$notify.error({
                title: '删除所选列表失败',
                message: e,
                duration: 3000
              })
            }
          })
        }
        done()
        close()
      } catch {
        done()
      }
    },
    handleSearch() {
      if (this.isSearching) {
        this.$emit('update:searchKey', '')
        return
      }
      this.$openFormDialog({
        title: '全盘搜索',
        formProps: {
          'label-width': '80px'
        },
        on: {
          submit: (data, { close }) => {
            this.$emit('update:searchKey', data.key)
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
    handleUpload() {
      this.$refs.uploadDrawer.open(this.parsePath())
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
              this.$emit('changed')
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
    }
  }
}
</script>

<style lang="scss" scoped>
.netdisk-file-operate-container {
  display: inline-block;

  i {
      margin-right: 5px;
  }
}
</style>
