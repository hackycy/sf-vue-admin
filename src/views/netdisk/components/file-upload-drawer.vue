<template>
  <div class="file-upload-drawer-container">
    <el-drawer
      :size="400"
      :visible="visible"
      direction="rtl"
      :with-header="false"
      :wrapper-closable="false"
      :before-close="handleClose"
    >
      <div v-loading="loading" class="upload-inner-box">
        <div class="header">
          <el-row type="flex">
            <el-col :span="23">{{ title }}</el-col>
            <el-col
              :span="1"
            ><i
              class="el-icon-close"
              @click="handleClose"
            /></el-col>
          </el-row>
        </div>
        <el-upload
          ref="upload"
          class="upload"
          drag
          action="noaction"
          :multiple="true"
          :on-error="onError"
          :http-request="uploadFile"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { isEmpty } from 'lodash'
import { getToken } from '@/api/netdisk/manage'
import * as qiniu from 'qiniu-js'

export default {
  name: 'FileUploadDrawer',
  data() {
    return {
      loading: false,
      visible: false,
      path: '',
      token: '',
      subscribes: [],
      // 成功的请求
      successSubs: []
    }
  },
  computed: {
    title() {
      return `上传文件到 ${
        isEmpty(this.path) ? '根' : this.path.substring(0, this.path.length - 1)
      } 目录`
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
      if (this.subscribes.length > 0 && this.subscribes.length !== this.successSubs.length) {
        this.$confirm('关闭会取消未上传的文件，确认关闭吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.close()
          })
          .catch(() => {})
      } else {
        this.close()
      }
    },
    close() {
      // hidden
      this.visible = false
      this.loading = false
      this.path = ''
      this.token = ''
      this.clear()
    },
    /**
     * 使用qiniu-js上传
     */
    uploadFile(param) {
      // onProgress, onError, onSuccess
      const { file, onProgress, onError, onSuccess } = param
      const observable = qiniu.upload(
        file,
        `${this.path}${file.name}`,
        this.token
      )
      const sub = observable.subscribe({
        next: res => {
          // https://github.com/ElemeFE/element/issues/9759
          onProgress({ percent: res.total.percent })
        },
        error: (err, file) => {
          onError(err)
        },
        complete: res => {
          this.successSubs.push(sub)
          onSuccess(res)
        }
      })
      this.subscribes.push(sub)
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
    clear() {
      if (this.subscribes.length <= 0) {
        return
      }
      const subsTmpArr = this.subscribes
      const successSubsTmpArr = this.successSubs
      // clean
      this.subscribes = []
      this.successSubs = []
      // un sub
      if (subsTmpArr.length !== successSubsTmpArr.length) {
        for (let i = 0; i < subsTmpArr.length; i++) {
          subsTmpArr[i].unsubscribe()
          subsTmpArr[i] = null
        }
      }
      this.$refs.upload && this.$refs.upload.clearFiles()
      // emit
      this.$nextTick(() => {
        this.$emit('changed')
      })
    }
  }
}
</script>

<style lang="scss">
.file-upload-drawer-container {
  .el-drawer__body {
    height: 100%;

    .upload-inner-box {
      width: 100%;
      height: 100%;
      display: flex;
      display: -webkit-flex;
      flex-direction: column;
      padding: 0 10px;

      .header {
        height: 40px;
        font-size: 16px;
        line-height: 40px;

        i {
          cursor: pointer;
        }
      }

      .upload {
        flex: 1;
        display: flex;
        padding-bottom: 10px;
        display: -webkit-flex;
        flex-direction: column;
        width: 100%;
        height: 0;
        position: relative;

        .el-upload-list {
          overflow: auto;
          flex: 1;
        }

        .el-upload {
          width: 100%;

          .el-upload-dragger {
            width: 100%;
          }
        }
      }

      .footer {
        padding: 10px 0;
      }
    }
  }
}
</style>
