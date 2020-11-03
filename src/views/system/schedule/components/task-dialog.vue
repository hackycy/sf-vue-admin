<template>
  <el-dialog
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :title="alertTitle"
    :visible.sync="visible"
    :before-close="dismiss"
    center
    size="mini"
    top="10vh"
    @open="handleDialogOpen"
    @closed="handleDialogClosed"
  >
    <el-form
      ref="taskForm"
      v-loading="isDialogLoading"
      :model="taskForm"
      :rules="getTaskTypeRulues()"
    >
      <el-form-item label="任务类型" label-width="80px">
        <el-radio-group v-model="taskForm.type" @change="handleTaskTypeChange">
          <el-radio :label="0">cron</el-radio>
          <el-radio :label="1">时间间隔</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="任务名称" label-width="80px" prop="name">
        <el-input v-model="taskForm.name" placeholder="请输入任务名称" />
      </el-form-item>
      <el-form-item label="Service" label-width="80px" prop="service">
        <el-input v-model="taskForm.service" placeholder="请输入调用路径" />
      </el-form-item>
      <el-form-item label="执行参数" label-width="80px" prop="data">
        <el-input v-model="taskForm.data" placeholder="请输入执行参数" />
      </el-form-item>
      <el-form-item label="执行次数" label-width="80px">
        <el-input-number
          v-model="taskForm.limit"
          controls-position="right"
          style="width: 100%;"
        />
      </el-form-item>
      <!-- 分面板 -->
      <!-- cron面板 -->
      <div v-if="taskForm.type === 0">
        <el-form-item label="cron" label-width="80px" prop="cron">
          <el-input v-model="taskForm.cron" placeholder="请输入cron表达式" />
        </el-form-item>
        <el-form-item label="开始时间" label-width="80px">
          <el-date-picker v-model="taskForm.startTime" type="datetime" placeholder="选择开始日期" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="结束时间" label-width="80px">
          <el-date-picker v-model="taskForm.endTime" type="datetime" placeholder="选择结束日期" style="width: 100%;" />
        </el-form-item>
      </div>
      <!-- 间隔面板 -->
      <div v-if="taskForm.type === 1">
        <el-form-item label="执行间隔" label-width="80px" prop="every">
          <el-input-number
            v-model="taskForm.every"
            controls-position="right"
            :min="1000"
            style="width: 100%;"
          />
        </el-form-item>
      </div>
      <el-form-item label="备注" label-width="80px">
        <el-input v-model="taskForm.remark" type="textarea" />
      </el-form-item>
      <el-form-item label="状态" label-width="80px">
        <el-radio-group v-model="taskForm.status">
          <el-radio v-if="taskForm.status !== 2" :label="0">暂停</el-radio>
          <el-radio :label="1">运行</el-radio>
          <el-radio v-if="taskForm.status === 2" :label="2">完成</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 分面板结束 -->
    </el-form>
    <div slot="footer">
      <el-row type="flex" justify="end">
        <el-button size="mini" @click="dismiss">取消</el-button>
        <el-button type="primary" size="mini" :loading="isSaveLoading" @click="handleSaveTask">保存</el-button>
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
        service: '',
        limit: 0,
        cron: '',
        every: 0,
        data: '',
        status: 1,
        remark: '',
        startTime: '',
        endTime: ''
      },
      taskFormRules: {
        cron: {
          name: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
          service: [{ required: true, message: '请输入service调用路径', trigger: 'blur' }],
          cron: [{ required: true, message: '请输入cron表达式', trigger: 'blur' }]
        },
        interval: {
          name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
          service: [{ required: true, message: '请输入service调用路径', trigger: 'blur' }],
          every: [{ required: true, message: '请输入执行间隔', trigger: 'blur' }]
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
        this.$refs.taskForm.clearValidate()
      }
      if (this.mode === 1 && this.taskId !== -1) {
        try {
          this.isDialogLoading = true
          const { data } = await this.$service.sys.task.info({ id: this.taskId })
          this.taskForm = data
          this.isDialogLoading = false
        } catch (e) {
          this.$message.error('获取信息失败')
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
        service: '',
        limit: 0,
        cron: '',
        every: 0,
        data: '',
        status: 1,
        remark: '',
        startTime: '',
        endTime: ''
      }
    },
    getTaskTypeRulues() {
      switch (this.taskForm.type) {
        case 0:
          return this.taskFormRules.cron
        case 1:
          return this.taskFormRules.interval
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
          this.isSaveLoading = true
          try {
            if (this.mode === 1) {
              await this.$service.sys.task.update(Object.assign(postData, { id: this.taskId }))
            } else if (this.mode === 0) {
              await this.$service.sys.task.add(postData)
            }
            this.isSaveLoading = false
            this.$message.success('保存成功')
            this.success()
            this.dismiss()
          } catch (e) {
            this.isSaveLoading = false
            this.fail()
            this.dismiss()
          }
        } else {
          this.$message.warning('请正确填写内容')
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
