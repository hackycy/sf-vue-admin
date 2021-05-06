<template>
  <el-dialog
    v-el-drag-dialog
    width="40%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :visible="visible"
    :title="title"
    center
    :before-close="handleClose"
  >
    <div v-loading="loading" class="file-upload-dialog-container">
      <el-upload
        class="upload"
        drag
        action="noaction"
        :on-error="onError"
        :on-progress="onProgress"
        :on-success="onSuccess"
        :multiple="false"
        :show-file-list="false"
        :http-request="uploadFile"
        :disabled="isUploading"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <el-progress
        v-show="isUploading"
        :stroke-width="18"
        :percentage="percentage"
        :text-inside="true"
      />
    </div>
  </el-dialog>
</template>

<script>
import { isEmpty } from 'lodash'
import { getToken } from '@/api/file/space'
import * as qiniu from 'qiniu-js'

export default {
  name: 'FileUploadDialog',
  data() {
    return {
      loading: false,
      visible: false,
      path: '',
      token: '',
      isUploading: false,
      percentage: 0,
      subscription: null
    }
  },
  computed: {
    title() {
      return `上传文件到 ${isEmpty(this.path) ? '根' : this.path.substring(0, this.path.length - 1)} 目录`
    }
  },
  methods: {
    open(path) {
      this.path = path
      // showing dialog
      this.visible = true
      this.$nextTick(() => {
        this.loading = true
        // get qiniu upload token
        getToken()
          .then(res => {
            const { data } = res
            this.token = data.token
            // hide loading
            this.loading = false
          })
          .catch(() => {
            // close
            this.visible = false
          })
      })
    },
    handleClose() {
      // hidden
      this.visible = false
      this.loading = false
      this.path = ''
      this.token = ''
      this.resetProgress()
      this.isUploading = false
      if (this.subscription) {
        // un sub
        this.subscription.unsubscribe()
        this.subscription = null
      }
      this.$nextTick(() => {
        this.$emit('closed')
      })
    },
    /**
     * 使用qiniu-js上传
     */
    uploadFile(param) {
      // onProgress, onError, onSuccess
      this.resetProgress()
      this.isUploading = true
      const { file, onProgress, onError, onSuccess } = param
      const observable = qiniu.upload(
        file,
        `${this.path}${file.name}`,
        this.token
      )
      this.subscription = observable.subscribe({
        next: res => {
          onProgress(res.total)
        },
        error: (err, file) => {
          this.isUploading = false
          onError(err, file)
        },
        complete: res => {
          this.isUploading = false
          onSuccess(res, file)
        }
      })
    },
    onSuccess(_, file) {
      this.$notify({
        title: '上传进度提醒',
        message: `上传${file.name}文件成功！`,
        type: 'success'
      })
    },
    onError(err, file) {
      this.$notify.error({
        title: '上传进度提醒',
        message: `上传${file.name}文件失败！错误信息：${
          err.code === 614 ? '上传文件已存在' : err.message
        }`,
        duration: 0
      })
    },
    onProgress(total) {
      this.percentage = Math.floor(total.percent)
    },
    resetProgress() {
      this.percentage = 0
    }
  }
}
</script>

<style lang="scss">
.file-upload-dialog-container {
  width: 100%;
  padding: 0 10px;

  .upload {
    margin-bottom: 10px;
    .el-upload {
      width: 100%;

      .el-upload-dragger {
        width: 100%;
      }
    }
  }
}
</style>
