<template>
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :title="alertTitle"
    :visible.sync="visible"
    :before-close="dismiss"
    center
    size="mini"
    @open="handleDialogOpen"
    @closed="handleDialogClosed"
  >
    <el-form
      ref="menuForm"
      v-loading="isDialogLoading"
      :model="menuForm"
      :rules="getMenuTypeRulues()"
    >
      <el-form-item label="菜单类型" label-width="80px">
        <el-radio-group v-model="menuForm.type" @change="handleMenuTypeChange">
          <el-radio :label="0">目录</el-radio>
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">权限</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="节点名称" label-width="80px" prop="name">
        <el-input v-model="menuForm.name" placeholder="请输入节点名称" />
      </el-form-item>
      <el-form-item label="上级节点" label-width="80px" prop="parentNodeName">
        <el-popover placement="bottom-start" width="500">
          <el-tree
            node-key="id"
            :expand-on-click-node="false"
            :data="menuTree.data"
            :props="menuTree.props"
            @node-click="handleMenuNodeClick"
          />
          <el-input
            slot="reference"
            v-model="menuForm.parentNodeName"
            placeholder="请选择上级节点"
            readonly
          />
        </el-popover>
      </el-form-item>
      <!-- 分面板 -->
      <!-- 目录面板 -->
      <div v-if="menuForm.type === 0" class="catalog-pane">
        <el-form-item label="节点路由" label-width="80px" prop="router">
          <el-input v-model="menuForm.router" placeholder="请输入节点路由" />
        </el-form-item>
        <el-form-item label="节点图标" label-width="80px" prop="icon">
          <el-select v-model="menuForm.icon" placeholder="请选择图标" style="width: 100%;">
            <el-option v-for="item in svgIcons" :key="item" :label="item" :value="item">
              <span style="float: left; font-size: 16px; color: #444444;">
                <svg-icon :icon-class="item" class-name="select-icon" />
              </span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示" label-width="80px">
          <el-switch v-model="menuForm.isShow" />
        </el-form-item>
      </div>
      <!-- 菜单面板 -->
      <div v-if="menuForm.type === 1" class="menu-pane">
        <el-form-item label="节点路由" label-width="80px" prop="router">
          <el-input v-model="menuForm.router" placeholder="请输入节点路由" />
        </el-form-item>
        <el-form-item label="节点图标" label-width="80px" prop="icon">
          <el-select v-model="menuForm.icon" placeholder="请选择图标" style="width: 100%;">
            <el-option v-for="item in svgIcons" :key="item" :label="item" :value="item">
              <span style="float: left; font-size: 16px; color: #444444;">
                <svg-icon :icon-class="item" class-name="select-icon" />
              </span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件路径" label-width="80px" prop="viewPath">
          <el-select v-model="menuForm.viewPath" placeholder="请选择文件路径" style="width: 100%;">
            <el-option v-for="item in getViewFiles()" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="menuForm.type !== 2" label="是否显示" label-width="80px">
          <el-switch v-model="menuForm.isShow" />
        </el-form-item>
        <el-form-item v-if="menuForm.type === 1" label="开启缓存" label-width="80px">
          <el-switch v-model="menuForm.keepalive" />
        </el-form-item>
      </div>
      <!-- 权限面板 -->
      <div v-if="menuForm.type === 2" class="perms-pane">
        <el-form-item label="权限" label-width="80px" prop="perms">
          <el-cascader
            v-model="menuForm.perms"
            separator=":"
            style="width: 100%;"
            :options="perms.options"
            :props="perms.props"
            clearable
          />
        </el-form-item>
      </div>
      <!-- 分面板结束 -->
      <el-form-item label="排序号" label-width="80px">
        <el-input-number
          v-model="menuForm.orderNum"
          controls-position="right"
          :min="0"
          style="width: 100%;"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-row type="flex" justify="end">
        <el-button size="mini" @click="dismiss">取消</el-button>
        <el-button type="primary" size="mini" :loading="isSaveLoading" @click="handleSaveMenu">保存</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import * as _ from 'lodash'
import svgIcons from '@/utils/svg-icons'
import { asyncRoutesMap } from '@/router'
import { flatPerms, filterPerms } from '@/utils/permission'

export default {
  name: 'SysMenuDialog',
  props: {
    mode: { // 0为新增。1为编辑
      type: Number,
      default: 0,
      validator: function(value) {
        return value === 0 || value === 1
      }
    },
    menuId: {
      type: Number,
      default: -1
    },
    menuTree: {
      type: Object,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      svgIcons,
      isSaveLoading: false,
      isDialogLoading: false,
      menuForm: {
        type: 0,
        name: '',
        parentId: -1,
        parentNodeName: '',
        router: '',
        perms: [],
        icon: '',
        orderNum: 0,
        viewPath: '',
        isShow: true,
        keepalive: true
      },
      menuFormRules: {
        catalog: {
          name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
          router: [{ required: true, message: '请输入节点路由', trigger: 'blur' }],
          parentNodeName: [{ required: true, message: '请输入上级节点', trigger: 'blur' }]
        },
        menu: {
          name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
          router: [{ required: true, message: '请输入节点路由', trigger: 'blur' }],
          parentNodeName: [{ required: true, message: '请输入上级节点', trigger: 'blur' }]
          // viewPath: [{ required: true, message: '请选择文件地址', trigger: 'blur' }]
        },
        perm: {
          parentNodeName: [{ required: true, message: '请输入上级节点', trigger: 'blur' }],
          name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
          perms: [{ required: true, message: '请选择权限', trigger: 'blur' }]
        }
      },
      perms: {
        // 权限
        props: { multiple: true },
        options: []
      }
      // menuTree: {
      //   data: [],
      //   props: {
      //     children: 'children',
      //     label: 'label'
      //   }
      // }
    }
  },
  computed: {
    alertTitle: function() {
      return this.mode === 0 ? '新增' : '编辑'
    }
  },
  created() {
    this.initPerms()
  },
  methods: {
    async handleDialogOpen() {
      if (this.$refs.menuForm) {
        // this.$refs.menuForm.resetField()
        this.$refs.menuForm.clearValidate()
      }
      if (this.mode === 1 && this.menuId !== -1) {
        try {
          this.isDialogLoading = true
          const { data } = await this.$service.sys.menu.info({ menuId: this.menuId })
          const { menu, parentMenu } = data
          const tmp = { ...menu }
          delete tmp.createTime
          delete tmp.updateTime
          if (!parentMenu) {
            tmp.parentId = -1
            tmp.parentNodeName = '一级菜单'
          } else {
            tmp.parentNodeName = parentMenu.name
          }
          if (tmp.type === 2) {
            // 处理权限
            const arr = this.splitPerms(tmp.perms)
            tmp.perms = arr.map(e => {
              return e.split(':')
            })
          }
          this.menuForm = { ...tmp }
          this.isDialogLoading = false
        } catch (e) {
          this.$message({
            type: 'warning',
            message: '获取菜单信息失败'
          })
          this.dismiss()
        }
      }
    },
    handleDialogClosed() {
      // 重置表单
      // reset data
      this.menuForm = {
        type: 0,
        name: '',
        parentId: -1,
        parentNodeName: '',
        router: '',
        perms: '',
        icon: '',
        orderNum: 0,
        viewPath: '',
        isShow: true,
        keepalive: true
      }
      // if (this.$refs.menuForm) {
      //   // this.$refs.menuForm.resetField()
      //   this.$refs.menuForm.clearValidate()
      // }
    },
    getViewFiles() {
      return Object.keys(asyncRoutesMap)
    },
    // 初始化权限数据
    initPerms() {
      const options = []
      flatPerms(this.$service).filter((e) => e.includes(':'))
        .map(e => e.split(':'))
        .forEach(arr => {
          filterPerms(0, arr, options)
        })
      this.perms.options = options
    },
    getMenuTypeRulues() {
      switch (this.menuForm.type) {
        case 0:
          return this.menuFormRules.catalog
        case 1:
          return this.menuFormRules.menu
        case 2:
          return this.menuFormRules.perm
      }
    },
    splitPerms(perms) {
      if (perms) {
        const permsArray = perms.split(',')
        if (permsArray && permsArray.length > 0) {
          return permsArray
        }
      }
      return []
    },
    joinPerms(perms) {
      if (_.isEmpty(perms)) {
        return ''
      }
      const arr = perms.map(e => {
        return _.join(e, ':')
      })
      return _.join(arr, ',')
    },
    handleMenuTypeChange() {
      if (this.$refs.menuForm) {
        this.$refs.menuForm.clearValidate()
      }
    },
    handleMenuNodeClick(data) {
      this.menuForm.parentId = data.id
      this.menuForm.parentNodeName = data.label
    },
    handleSaveMenu() {
      this.$refs.menuForm.validate(async valid => {
        if (valid) {
          const postData = { ...this.menuForm }
          postData.parentId = this.menuForm.parentId
          delete postData.parentNodeName
          if (postData.type === 2) {
            // 处理权限
            postData.perms = this.joinPerms(postData.perms)
          } else {
            delete postData.perms
          }
          this.isSaveLoading = true
          try {
            if (this.mode === 1) {
              await this.$service.sys.menu.update({ ...postData, menuId: this.menuId })
            } else if (this.mode === 0) {
              await this.$service.sys.menu.add(postData)
            }
            this.isSaveLoading = false
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.success()
            this.dismiss()
          } catch (e) {
            this.isSaveLoading = false
            this.fail()
            this.dismiss()
          }
        } else {
          this.$message({
            message: '请正确填写内容',
            type: 'warning'
          })
          return false
        }
      })
    },
    dismiss() {
      // 父组件用于设置dialog隐藏dialog
      this.$emit('dismiss')
    },
    success(data) {
      this.$emit('success')
    },
    fail() {
      this.$emit('fail')
    }
  }
}
</script>

<style lang="scss" scoped>
.select-icon {
  font-size: 16px;
}
</style>
