<template>
  <el-drawer
    :size="500"
    title="文件详情"
    :visible="visible"
    direction="rtl"
    :before-close="handleClose"
  >
    <div v-loading="loading" class="preview-drawer-inner-box">
      <div class="image-preview-container">
        <el-image
          fit="contain"
          :style="{
            width: disabledPreview ? '130px' : '100%',
            height: disabledPreview ? '85px' : '210px'
          }"
          :src="disabledPreview ? unPreviewImage : imageView2Handle"
          :preview-src-list="[previewSrc]"
          :z-index="999999"
        />
      </div>
      <el-row
        v-for="(item, index) in detailKeys"
        :key="index"
        type="flex"
        :gutter="4"
        class="item-box"
      >
        <el-col
          :span="6"
        ><span class="label">{{ detailLabels[index] }}</span></el-col>
        <el-col
          :span="18"
        ><span class="info">{{ detailInfos[index] }}</span></el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script>
import { getFileDetailInfo, getDownloadLink } from '@/api/netdisk/manage'
import { formatSizeUnits } from '@/utils'
import { isEmpty } from 'lodash'
import noPreviewImage from '@/assets/no-preview.png'

export default {
  name: 'FilePreviewDrawer',
  data() {
    return {
      loading: false,
      visible: false,
      detailKeys: [
        'name',
        'mimeType',
        'hash',
        'md5',
        'fsize',
        'putTime',
        'uploader'
      ],
      detailLabels: [
        '文件名',
        '文件类型',
        '文件Hash',
        '文件MD5',
        '文件大小',
        '上传时间',
        '操作人'
      ],
      detailInfos: [],
      previewSrc: '',
      unPreviewImage: noPreviewImage
    }
  },
  computed: {
    disabledPreview() {
      return isEmpty(this.previewSrc)
    },
    // 使用七牛图片处理，减少预览耗费流量
    imageView2Handle() {
      return `${this.previewSrc}?imageView2/2/w/500/h/210`
    }
  },
  methods: {
    open(name, path) {
      this.visible = true
      this.$nextTick(async() => {
        try {
          this.loading = true
          const fileInfo = {
            name,
            path
          }
          const { data } = await getFileDetailInfo(fileInfo)
          this.detailInfos.push(name)
          for (let i = 1; i < this.detailKeys.length; i++) {
            if (this.detailKeys[i] === 'fsize') {
              this.detailInfos.push(formatSizeUnits(data[this.detailKeys[i]]))
            } else {
              this.detailInfos.push(data[this.detailKeys[i]])
            }
          }
          if (
            this.$auth('netdiskManage.download') &&
            data.mimeType.includes('image/')
          ) {
            // 可预览
            const { data: url } = await getDownloadLink(fileInfo)
            this.previewSrc = url
          }
        } catch {
          this.handleClose()
        } finally {
          this.loading = false
        }
      })
    },
    handleClose() {
      this.visible = false
      this.previewSrc = ''
      this.detailInfos = []
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-drawer-inner-box {
  width: 100%;
  padding: 0 20px;

  .image-preview-container {
    padding: 10px;
    margin: 10px;

    img {
      object-fit: contain;
    }

    .no-preview {
      height: 85px;
      width: 130px;
    }

    .preview {
      width: 100%;
      height: 210px;
    }
  }

  .item-box {
    width: 100%;
    margin: 14px 0;
    min-height: 30px;
    line-height: 30px;
    font-size: 14px;

    .label {
      display: inline-block;
      color: #262626;
    }

    .info {
      color: #8c8c8c;
      word-wrap: break-word;
    }
  }
}
</style>
