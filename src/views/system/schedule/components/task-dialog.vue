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
      ref="taskForm"
      v-loading="isDialogLoading"
      :model="taskForm"
      :rules="gettaskTypeRulues()"
    >
      <el-form-item label="任务类型" label-width="80px">
        <el-radio-group v-model="taskForm.type" @change="handletaskTypeChange">
          <el-radio :label="0">cron</el-radio>
          <el-radio :label="1">时间间隔</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="任务名称" label-width="80px" prop="name">
        <el-input v-model="taskForm.name" placeholder="请输入任务名称" />
      </el-form-item>
      <!-- 分面板 -->
      <!-- 目录面板 -->
      <div v-if="taskForm.type === 0" class="catalog-pane">
        <el-form-item label="节点路由" label-width="80px" prop="router">
          <el-input v-model="taskForm.router" placeholder="请输入节点路由" />
        </el-form-item>
        <el-form-item label="节点图标" label-width="80px" prop="icon">
          <el-select v-model="taskForm.icon" placeholder="请选择图标" style="width: 100%;">
            <el-option v-for="item in svgIcons" :key="item" :label="item" :value="item">
              <span style="float: left; font-size: 16px; color: #444444;">
                <svg-icon :icon-class="item" class-name="select-icon" />
              </span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示" label-width="80px">
          <el-switch v-model="taskForm.isShow" />
        </el-form-item>
      </div>
      <!-- 菜单面板 -->
      <div v-if="taskForm.type === 1" class="task-pane">
        <el-form-item label="节点路由" label-width="80px" prop="router">
          <el-input v-model="taskForm.router" placeholder="请输入节点路由" />
        </el-form-item>
        <el-form-item label="节点图标" label-width="80px" prop="icon">
          <el-select v-model="taskForm.icon" placeholder="请选择图标" style="width: 100%;">
            <el-option v-for="item in svgIcons" :key="item" :label="item" :value="item">
              <span style="float: left; font-size: 16px; color: #444444;">
                <svg-icon :icon-class="item" class-name="select-icon" />
              </span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件路径" label-width="80px" prop="viewPath">
          <el-select v-model="taskForm.viewPath" placeholder="请选择文件路径" style="width: 100%;">
            <el-option v-for="item in getViewFiles()" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="taskForm.type !== 2" label="是否显示" label-width="80px">
          <el-switch v-model="taskForm.isShow" />
        </el-form-item>
        <el-form-item v-if="taskForm.type === 1" label="开启缓存" label-width="80px">
          <el-switch v-model="taskForm.keepalive" />
        </el-form-item>
      </div>
      <!-- 分面板结束 -->
    </el-form>
    <div slot="footer">
      <el-row type="flex" justify="end">
        <el-button size="mini" @click="dismiss">取消</el-button>
        <el-button type="primary" size="mini" :loading="isSaveLoading" @click="handleSavetask">保存</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'SysTaskDialog',
  props: {
    mode: { // 0为新增。1为编辑
      type: Number,
      default: 0,
      validator: function(value) {
        return value === 0 || value === 1
      }
    },
    taskId: {
      type: Number,
      default: -1
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isSaveLoading: false,
      isDialogLoading: false,
      taskForm: {
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
      taskFormRules: {
        catalog: {
          name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
          router: [{ required: true, message: '请输入节点路由', trigger: 'blur' }],
          parentNodeName: [{ required: true, message: '请输入上级节点', trigger: 'blur' }]
        },
        task: {
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
      }
    }
  },
  computed: {
    alertTitle: function() {
      return this.mode === 0 ? '新增' : '编辑'
    }
  },
  methods: {
    async handleDialogOpen() {
      if (this.$refs.taskForm) {
        // this.$refs.taskForm.resetField()
        this.$refs.taskForm.clearValidate()
      }
      if (this.mode === 1 && this.taskId !== -1) {
        try {
          this.isDialogLoading = true
          const { data } = await this.$service.sys.task.info({ taskId: this.taskId })
          const { task, parenttask } = data
          const tmp = { ...task }
          delete tmp.createTime
          delete tmp.updateTime
          if (!parenttask) {
            tmp.parentId = -1
            tmp.parentNodeName = '一级菜单'
          } else {
            tmp.parentNodeName = parenttask.name
          }
          if (tmp.type === 2) {
            // 处理权限
            const arr = this.splitPerms(tmp.perms)
            tmp.perms = arr.map(e => {
              return e.split(':')
            })
          }
          this.taskForm = { ...tmp }
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
      this.taskForm = {
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
      // if (this.$refs.taskForm) {
      //   // this.$refs.taskForm.resetField()
      //   this.$refs.taskForm.clearValidate()
      // }
    },
    getTaskTypeRulues() {
      switch (this.taskForm.type) {
        case 0:
          return this.taskFormRules.catalog
        case 1:
          return this.taskFormRules.task
        case 2:
          return this.taskFormRules.perm
      }
    },
    handleTaskTypeChange() {
      if (this.$refs.taskForm) {
        this.$refs.taskForm.clearValidate()
      }
    },
    handleSaveTask() {
      this.$refs.taskForm.validate(async valid => {
        if (valid) {
          const postData = { ...this.taskForm }
          postData.parentId = this.taskForm.parentId
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
              await this.$service.sys.task.update({ ...postData, taskId: this.taskId })
            } else if (this.mode === 0) {
              await this.$service.sys.task.add(postData)
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
