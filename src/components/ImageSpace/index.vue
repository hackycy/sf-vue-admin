import request from '@/utils/request';
<template>
  <el-dialog
    title="图片空间"
    :visible.sync="visible"
    :before-close="dismiss"
    :destroy-on-close="true"
    :fullscreen="fullscreen"
    center
    width="60%"
    size="mini"
    @open="handleDialogOpen"
  >
    <div class="image-space-container">
      <div class="type-pane">
        <div class="type-header">
          <el-button size="mini" type="primary" @click="handleAddType">添加分类</el-button>
          <el-input
            v-model="typeText"
            size="mini"
            placeholder="请输入分类名称"
            clearable
            style="margin-left : 5px;"
          />
        </div>
        <div class="type-content">
          <ul v-loading="isTypeLoading">
            <li
              v-for="item in typeList"
              :key="item.id"
              :class="{ active: selectTypeId === item.id }"
              class="item"
              @click="handleChangeType(item.id)"
            >
              {{ item.name }}
              <span v-if="item.id !== -1">
                <i class="el-icon-remove" @click.stop="handleDeleteType(item.id)" />
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="image-list-pane">
        <div class="image-list-header">
          <el-button size="mini" type="success" @click="handleUseSelectImage">使用选中图片</el-button>
          <el-button
            size="mini"
            type="danger"
            :loading="isDeleteLoading"
            @click="handleDeleteSelectImage"
          >删除选中图片</el-button>
          <el-upload
            style="display: inline-block; margin-left: 10px;"
            action
            :limit="1"
            :show-file-list="false"
            :http-request="upload"
          >
            <el-button :loading="isUploadLoading" size="mini" type="primary">点击上传</el-button>
          </el-upload>
        </div>
        <div v-loading="isImageLoading" class="image-list-content">
          <ul>
            <li
              v-for="item in imageList"
              :key="item.id"
              class="item"
              @click="handleSelectItem(item)"
            >
              <el-image style="width: 100%; height: 100%;" :src="item.url" fit="contain" />
              <div v-if="isShowMask(item.id)" class="selected">
                <i class="el-icon-success" />
              </div>
            </li>
          </ul>
        </div>
        <div class="image-list-footer">
          <el-badge :value="getSelectedSize" class="badge">已选中</el-badge>
          <el-pagination
            small
            background
            :total="imageTotal"
            :current-page.sync="currentPage"
            :page-size="12"
            layout="prev, pager, next, jumper"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ImageSpaceDialog',
  props: {
    multiple: {
      // 是否多选
      type: Boolean,
      default: false
    },
    fullscreen: {
      // 是否全屏显示
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isImageLoading: false,
      isTypeLoading: false,
      isUploadLoading: false,
      isDeleteLoading: false,
      selectTypeId: -1,
      currentPage: 1,
      typeList: [],
      imageList: [],
      imageTotal: 0,
      selectedList: [],
      typeText: ''
    }
  },
  computed: {
    getSelectedSize() {
      return this.selectedList.length
    }
  },
  methods: {
    async getTypeList() {
      this.isTypeLoading = true
      const { data } = await this.$service.space.image.type()
      const list = [{ id: -1, name: '全部图片' }]
      this.typeList = list.concat(
        data.map((e) => {
          return {
            id: e.id,
            name: e.name
          }
        })
      )
      this.isTypeLoading = false
    },
    async getImageList() {
      this.isImageLoading = true
      const { data } = await this.$service.space.image.page({
        typeId: this.selectTypeId,
        page: this.currentPage
      })
      this.imageList = data.images || []
      this.imageTotal = data.imageTotalCount
      this.isImageLoading = false
    },
    async upload(param) {
      if (this.selectTypeId === -1) {
        this.$message({
          message: '请先选择需要上传对应的分类',
          type: 'warning'
        })
      } else {
        this.isUploadLoading = true
        try {
          const form = new FormData()
          form.append('file', param.file)
          form.append('typeId', this.selectTypeId)
          await this.$service.space.image.upload(form)
          this.getImageList()
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.isUploadLoading = false
        } catch (e) {
          this.isUploadLoading = false
        }
      }
    },
    handleDialogOpen() {
      this.getTypeList()
      this.getImageList()
    },
    isShowMask(id) {
      const index = this.selectedList.findIndex(e => { return e.id === id })
      return index !== -1
    },
    handleSelectItem(item) {
      const index = this.selectedList.findIndex((e) => {
        return e.id === item.id
      })
      if (index === -1) {
        this.selectedList.push({ id: item.id, url: item.url })
      } else {
        this.selectedList.splice(index, 1)
      }
    },
    handleChangeType(id) {
      this.selectTypeId = id
      this.currentPage = 1
      this.getImageList()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.getImageList()
    },
    async handleAddType() {
      if (this.typeText) {
        await this.$service.space.image.addType({ name: this.typeText })
        this.typeText = ''
        this.getTypeList()
        this.$message({
          message: '添加成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '请输入分类名称',
          type: 'warning'
        })
      }
    },
    async handleDeleteType(id) {
      await this.$service.space.image.deleteType({ typeId: id })
      this.getTypeList()
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      if (this.selectTypeId === id) {
        this.selectTypeId = -1
      }
    },
    handleUseSelectImage() {
      if (this.selectedList && this.selectedList.length <= 0) {
        this.$message({
          message: '暂无选中图片',
          type: 'warning'
        })
        return
      }
      let data
      if (this.multiple) {
        data = this.selectedList.map(e => { return e.url })
      } else {
        data = this.selectedList[0].url
      }
      this.select(data)
    },
    async handleDeleteSelectImage() {
      if (this.selectedList && this.selectedList.length <= 0) {
        this.$message({
          message: '暂无选中图片',
          type: 'warning'
        })
        return
      }
      try {
        this.isDeleteLoading = true
        const data = this.selectedList.map(e => { return e.id })
        await this.$service.space.image.delete({ imageIds: data })
        this.getImageList()
        this.selectedList = []
        this.isDeleteLoading = false
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      } catch (e) {
        this.isDeleteLoading = false
      }
    },
    dismiss() {
      // 父组件用于设置dialog隐藏dialog
      this.selectedList = []
      this.selectTypeId = -1
      this.$emit('dismiss')
    },
    select(data) {
      this.$emit('select', data)
      this.dismiss()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin';

.image-space-container {
  display: flex;
  height: 580px;
  display: -webkit-flex;
  flex-direction: row;

  .type-pane {
    width: 250px;
    min-width: 250px;
    height: 100%;
    margin-right: 10px;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;

    .type-header {
      display: flex;
      display: -webkit-flex;
      flex-direction: row;
    }

    .type-content {
      height: 0;
      flex-grow: 1;
      padding: 10px 5px;

      ul,
      li {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      ul {
        height: 100%;
        overflow: auto;
        @include scrollBar;

        .item {
          position: relative;
          display: block;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          padding-left: 15px;
          cursor: pointer;

          &:hover {
            background-color: #cccccc40;
          }

          span {
            float: right;
            margin-right: 10px;
            font-size: 16px;
            cursor: pointer;

            &:hover {
              color: red;
            }
          }
        }

        .active {
          &::before {
            position: absolute;
            display: inline-block;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            border-radius: 2px;
            background: #177ca4;
            content: '';
          }
        }
      }
    }
  }

  .image-list-pane {
    flex-grow: 1;
    width: 0;
    height: 100%;
    overflow-y: hidden;
    overflow-x: auto;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;

    .image-list-content {
      height: 0;
      flex-grow: 1;
      margin-top: 10px;

      ul,
      li {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      li {
        position: relative;
      }

      ul {
        height: 100%;
        display: flex;
        display: -webkit-flex;
        flex-wrap: wrap;
        overflow: auto;
        @include scrollBar;

        .item {
          width: 200px;
          height: 240px;
          margin-right: 5px;
          margin-bottom: 5px;
          cursor: pointer;
        }

        .selected {
          position: absolute;
          text-align: center;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-color: #00000090;

          i {
            line-height: 240px;
            font-size: 30px;
            color: #13ce66;
            vertical-align: center;
          }
        }
      }
    }

    .image-list-footer {
      display: flex;
      display: -webkit-flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 10px;
      height: 30px;

      .badge {
        line-height: 30px;
      }
    }
  }
}
</style>
