<template>
  <div class="sys-param-config-container">
    <table-layout>
      <s-table
        ref="configTable"
        :data-request="getConfigList"
        show-pagination
        stripe
        row-key="id"
        border
        @selection-change="handleSelectionChange"
      >
        <template v-slot:prepend>
          <el-button
            size="mini"
            type="primary"
            :disabled="!$auth('sys.paramConfig.add')"
            @click="handleAdd"
          >新增</el-button>
          <warning-confirm-button
            button-type="danger"
            :closed="handleRefresh"
            :disabled="!$auth('sys.paramConfig.delete') || disableMultiDelete"
            @confirm="
              o => {
                handleDelete(null, o)
              }
            "
          >删除</warning-confirm-button>
        </template>
        <el-table-column
          fixed="left"
          type="selection"
          width="55"
          align="center"
        />
        <el-table-column
          prop="name"
          label="参数名称"
          align="center"
          width="220"
          show-overflow-tooltip
        />
        <el-table-column
          prop="key"
          width="220"
          show-overflow-tooltip
          label="参数键名"
          align="center"
        />
        <el-table-column
          prop="value"
          width="320"
          show-overflow-tooltip
          label="参数值"
          align="center"
        />
        <el-table-column
          prop="remark"
          show-overflow-tooltip
          width="300"
          label="备注"
          align="center"
        />
        <el-table-column
          prop="createdAt"
          width="180"
          label="创建时间"
          align="center"
        />
        <el-table-column
          prop="updatedAt"
          width="180"
          label="更新时间"
          align="center"
        />
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              :disabled="!$auth('sys.paramConfig.update')"
              size="mini"
              type="text"
              @click.stop="handleEdit(scope.row)"
            >编辑</el-button>
            <warning-confirm-button
              :closed="handleRefresh"
              :disabled="!$auth('sys.paramConfig.delete')"
              @confirm="
                o => {
                  handleDelete(scope.row, o)
                }
              "
            >删除</warning-confirm-button>
          </template>
        </el-table-column>
      </s-table>
    </table-layout>
  </div>
</template>

<script>
import TableLayout from '@/layout/components/TableLayout'
import STable from '@/components/Table'
import WarningConfirmButton from '@/components/WarningConfirmButton'

export default {
  name: 'SystemParamConfig',
  components: {
    TableLayout,
    STable,
    WarningConfirmButton
  },
  data() {
    return {
      selectionId: []
    }
  },
  computed: {
    disableMultiDelete() {
      return this.selectionId.length <= 0
    }
  },
  methods: {
    handleRefresh() {
      this.$refs.configTable.refresh()
    },
    async getConfigList({ page, limit }) {
      const { data } = await this.$api.sys.paramConfig.page({ page, limit })
      return data
    },
    handleSelectionChange(rows) {
      this.selectionId = rows.map(e => e.id)
    },
    handleAdd() {
      this.createFormDialog()
    },
    async handleDelete(row, { done, close }) {
      try {
        await this.$api.sys.paramConfig.delete({ ids: row ? [row.id] : this.selectionId })
        close()
      } catch (e) {
        done()
      }
    },
    handleEdit(row) {
      this.createFormDialog(row.id)
    },
    /**
     * 创建表单弹窗
     */
    createFormDialog(configId = -1) {
      this.$openFormDialog({
        title: '编辑参数配置',
        formProps: {
          'label-width': '100px'
        },
        on: {
          open: async(_, { showLoading, hideLoading, close, rebind }) => {
            if (configId !== -1) {
              // 编辑
              try {
                showLoading()
                const { data } = await this.$api.sys.paramConfig.info({ id: configId })
                rebind(data)
                hideLoading()
              } catch (e) {
                close()
              }
            }
          },
          submit: async(form, { close, done }) => {
            try {
              if (configId === -1) {
                // 新增
                await this.$api.sys.paramConfig.add(form)
              } else {
                delete form.key
                await this.$api.sys.paramConfig.update({ id: configId, ...form })
              }

              close()
              this.handleRefresh()
            } catch (e) {
              done()
            }
          }
        },
        items: [
          {
            prop: 'name',
            label: '参数名称',
            value: '',
            rules: {
              required: true,
              trigger: 'blur',
              message: '请输入参数名称'
            },
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入参数名称'
              }
            }
          },
          {
            prop: 'key',
            label: '参数键名',
            value: '',
            rules: {
              required: true,
              trigger: 'blur',
              message: '请输入参数键名'
            },
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入参数键名'
              },
              props: {
                // 编辑状态不可再变更
                disabled: configId !== -1
              }
            }
          },
          {
            prop: 'value',
            label: '参数值',
            value: '',
            rules: {
              required: true,
              trigger: 'blur',
              message: '请输入参数值'
            },
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入参数值'
              }
            }
          },
          {
            prop: 'remark',
            label: '备注',
            value: '',
            component: {
              name: 'el-input',
              props: {
                type: 'textarea',
                rows: 2
              }
            }
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
