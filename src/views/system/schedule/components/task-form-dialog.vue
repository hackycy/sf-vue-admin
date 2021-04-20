<template>
  <form-dialog ref="formDialog">
    <template #slot-type="{ scope }">
      <el-radio-group v-model="scope.type" @change="handleTaskTypeChange">
        <el-radio :label="0">Cron</el-radio>
        <el-radio :label="1">时间间隔</el-radio>
      </el-radio-group>
    </template>
    <template #slot-status="{ scope }">
      <el-radio-group v-model="scope.status">
        <el-radio :label="1">运行</el-radio>
        <el-radio :label="0">停止</el-radio>
      </el-radio-group>
    </template>
  </form-dialog>
</template>

<script>
import { isNumber } from 'lodash'
import { getTaskInfo, createTask, updateTask } from '@/api/sys/task'

export default {
  name: 'SystemScheduleTaskFormDialog',
  methods: {
    async handleOpen(updateId, form, { showLoading, hideLoading, close, rebind }) {
      if (updateId !== -1) {
        try {
          showLoading()
          const { data } = await getTaskInfo({ id: updateId })
          rebind(data)
          hideLoading()
        } catch {
          close()
        }
      }
    },
    handleSubmit(updateId, data, { close, done }) {
      let req = null
      if (updateId === -1) {
        // create
        req = createTask(data)
      } else {
        data.id = updateId
        req = updateTask(data)
      }
      req
        .then(_ => {
          this.$emit('save-success')
          close()
        })
        .catch(() => {
          done()
        })
    },
    open(updateId = -1) {
      if (!isNumber(updateId)) {
        throw new Error('task id must be a number')
      }
      this.$refs.formDialog.open({
        title: '编辑任务',
        on: {
          open: (form, op) => { this.handleOpen(updateId, form, op) },
          submit: (data, op) => { this.handleSubmit(updateId, data, op) }
        },
        items: [
          {
            label: '类型',
            prop: 'type',
            value: 0,
            rules: {
              required: true,
              message: '请选择任务类型',
              trigger: 'blur'
            },
            component: 'slot-type'
          },
          {
            label: '任务名称',
            prop: 'name',
            value: '',
            rules: {
              required: true,
              message: '请输入任务名称',
              trigger: 'blur'
            },
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入任务名称'
              }
            }
          },
          {
            label: '服务路径',
            prop: 'service',
            value: '',
            rules: {
              required: true,
              message: '请输入调用服务的路径',
              trigger: 'blur'
            },
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入调用服务的路径'
              }
            }
          },
          {
            label: '任务参数',
            prop: 'data',
            value: '',
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入任务参数（可不填）'
              }
            }
          },
          {
            label: '执行次数',
            prop: 'limit',
            value: -1,
            component: {
              name: 'el-input-number',
              style: {
                width: '100%'
              },
              props: {
                'controls-position': 'right',
                min: -1
              }
            }
          },
          {
            label: 'Cron',
            prop: 'cron',
            value: '',
            hidden: ({ scope }) => {
              return scope.type === 1
            },
            rules: {
              required: true,
              message: '请输入Cron表达式',
              trigger: 'blur'
            },
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入Cron表达式'
              }
            }
          },
          {
            label: '执行间隔',
            prop: 'every',
            value: 60000,
            rules: {
              required: true,
              message: '请输入Cron表达式',
              trigger: 'blur'
            },
            hidden: ({ scope }) => {
              return scope.type === 0
            },
            component: {
              name: 'el-input-number',
              style: {
                width: '100%'
              },
              props: {
                'controls-position': 'right',
                min: 0
              }
            }
          },
          {
            label: '开始日期',
            prop: 'startTime',
            value: '',
            hidden: ({ scope }) => {
              return scope.type === 1
            },
            component: {
              name: 'el-date-picker',
              props: {
                type: 'datetime'
              },
              style: {
                width: '100%'
              },
              attrs: {
                placeholder: '请选择开始日期'
              }
            }
          },
          {
            label: '结束日期',
            prop: 'endTime',
            value: '',
            hidden: ({ scope }) => {
              return scope.type === 1
            },
            component: {
              name: 'el-date-picker',
              props: {
                type: 'datetime'
              },
              style: {
                width: '100%'
              },
              attrs: {
                placeholder: '请选择结束日期'
              }
            }
          },
          {
            label: '备注',
            prop: 'remark',
            value: '',
            component: {
              name: 'el-input',
              props: {
                type: 'textarea',
                rows: 2
              }
            }
          },
          {
            label: '状态',
            prop: 'status',
            value: 1,
            component: 'slot-status'
          }
        ]
      })
    },
    handleTaskTypeChange() {
      if (this.$refs.formDialog) {
        this.$refs.formDialog.clearValidate()
      }
    }
  }
}
</script>
