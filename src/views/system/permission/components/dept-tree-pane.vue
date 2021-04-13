<template>
  <div class="dept-tree-pane-container">
    <div class="header-container">
      <div class="title">组织架构</div>
      <div class="op-container">
        <el-tooltip effect="dark" content="点击新增" placement="top-start">
          <i class="el-icon-plus" @click="handleAdd" />
        </el-tooltip>
        <el-tooltip effect="dark" content="点击刷新" placement="top-start">
          <i class="el-icon-refresh-right" @click="refresh" />
        </el-tooltip>
        <el-tooltip
          effect="dark"
          content="点击开启拖拽排序"
          placement="top-start"
        >
          <i
            class="el-icon-s-operation"
            @click="isDrag = true"
          />
        </el-tooltip>
        <span v-if="isDrag">
          <warning-confirm-button
            text="保存"
            content="确定保存当前更改的操作？"
            :disabled="!$auth('sysDept.move')"
            @confirm="handleSave"
          />
          <el-button
            size="small"
            type="text"
            @click="handleCancel"
          >取消</el-button>
        </span>
      </div>
    </div>
    <div v-loading="loading" class="tree-container">
      <el-tree
        ref="paneTree"
        style="height: 100%;"
        :props="{ children: 'children', label: 'label' }"
        :data="paneTreeList"
        highlight-current
        node-key="id"
        :expand-on-click-node="false"
        default-expand-all
        :draggable="isDrag"
        @node-click="handleNodeClick"
        @node-drop="handleNodeDrop"
        @node-contextmenu="handleShowContextMenu"
      />
    </div>

    <!-- form dialog -->
    <form-dialog ref="formDialog">
      <template #slot-parent-node-name="{ scope }">
        <el-popover placement="bottom-start" width="500">
          <el-tree
            :style="{ 'max-height': '400px', 'overflow-y': 'auto' }"
            node-key="id"
            :expand-on-click-node="false"
            :data="scope.parentNode.data"
            :props="{ children: 'children', label: 'label' }"
            @node-click="
              data => {
                scope.parentNode.id = data.id
                scope.parentNode.name = data.label
              }
            "
          />
          <el-input
            slot="reference"
            v-model="scope.parentNode.name"
            placeholder="请选择上级部门"
            readonly
          />
        </el-popover>
      </template>
    </form-dialog>
  </div>
</template>

<script>
import { findIndex, isNumber, flattenDeep } from 'lodash'
import WarningConfirmButton from '@/components/WarningConfirmButton'
import MessageBox from '@/mixins/message-box'
import PermissionMixin from '../../mixin/permission'
import { getDeptList, moveDeptList, deleteDept, createDept, updateDept, getDeptInfo } from '@/api/sys/dept'
import FormDialog from '@/components/FormDialog'

export default {
  name: 'SysDeptTreePane',
  components: {
    WarningConfirmButton,
    FormDialog
  },
  mixins: [PermissionMixin, MessageBox],
  data() {
    return {
      isDrag: false,
      loading: false,
      updateDeptId: -1,
      depts: [],
      drops: []
    }
  },
  computed: {
    /**
     * 面板tree树
     */
    paneTreeList() {
      return this.filterDeptToTree(this.depts, null)
    },
    /**
     * 弹窗上的tree树
     */
    dialogTreeList() {
      const parentNode = { id: -1, label: '#' }
      parentNode.children = this.paneTreeList
      return [parentNode]
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    /**
     * 供给外部获取自身data值
     */
    getDeptList() {
      return this.paneTreeList
    },
    /**
     * 根据部门id获取所有关联子部门的ID，包括自己
     */
    getDeptIdChildrenById(id) {
      if (id) {
        const node = this.$refs.paneTree.getNode(id)
        const find = (data) => {
          const res = []
          res.push(data.id)
          // 查找是否还存在子部门
          if (data.children && data.children.length > 0) {
            data.children.forEach(e => {
              res.push(find(e))
            })
          }
          return res
        }
        // flatten
        const result = find(node.data)
        return flattenDeep(result)
      }
      return null
    },
    async refresh() {
      this.loading = true
      try {
        const { data } = await getDeptList()
        this.depts = data || []
      } finally {
        this.loading = false
      }
    },
    async handleSave({ done, close }) {
      // diff 差异
      const data = this.drops.filter(e => {
        const index = findIndex(this.depts, o => o.id === e.id)
        if (index < 0) {
          return false
        }
        const parentId = this.depts[index].parentId
        // 两者都不为number类型时，则一直为根节点无变化
        if (!isNumber(parentId) && !isNumber(e.parentId)) {
          return false
        }
        // 两者不相等时代表发生变化
        return e.parentId !== parentId
      })
      try {
        if (data.length > 0) {
          await moveDeptList({ depts: data })
        }
        done()
        close()
        this.isDrag = false
        this.refresh()
      } catch {
        done()
      }
    },
    handleAdd() {
      this.openDialog()
    },
    handleUpdate(deptId) {
      this.openDialog(deptId)
    },
    handleDelete(deptId) {
      this.openLoadingConfirm({
        on: {
          confirm: async({ done, close }) => {
            try {
              await deleteDept({ departmentId: deptId })
              done()
              close()
            } catch {
              done()
            }
          },
          closed: () => {
            this.refresh()
          }
        }
      })
    },
    handleCancel() {
      if (this.drops && this.drops.length > 0) {
        // 清空并且重新拉去数据刷新内容
        this.drops = []
        this.refresh()
      }
      this.isDrag = false
    },
    handleNodeClick(data) {
      this.$emit('dept-change', data)
    },
    handleNodeDrop(before, after, position, _) {
      // 当拖拽类型不为inner,说明只是同级或者跨级排序，只需要寻找目标节点的父ID，获取其对象以及所有的子节点，并为子节点设置当前对象的ID为父ID即可
      // 当拖拽类型为inner，说明拖拽节点成为了目标节点的子节点，只需要获取目标节点对象即可
      // 设置父ID,当level为1说明在第一级，pid为空
      const { data: dept } = before
      const { data: parentDept } = position === 'inner' ? after : after.parent
      // find value
      const id = dept.id
      const parentId =
        position === 'inner'
          ? parentDept.id
          : after.level === 1
            ? null
            : parentDept.id
      // 是否已存在
      const index = findIndex(this.drops, o => o.id === dept.id)
      if (index >= 0) {
        this.drops[index].parentId = parentId
      } else {
        // not exist
        this.drops.push({ id: id, parentId: parentId })
      }
    },
    handleShowContextMenu(event, data) {
      // 打开右键菜单
      this.$openContextMenu(event, {
        meta: data,
        items: [
          {
            disabled: !this.$auth('sysDept.update'),
            title: '编辑',
            icon: 'el-icon-edit',
            callback: this.handleContextMenuClick
          },
          {
            disabled: !this.$auth('sysDept.delete'),
            title: '删除',
            icon: 'el-icon-delete',
            callback: this.handleContextMenuClick
          }
        ]
      })
    },
    handleContextMenuClick({ item, index, close, meta }) {
      if (index === 0) {
        // update
        this.handleUpdate(meta.id)
      } else if (index === 1) {
        // delete
        this.handleDelete(meta.id)
      }
      close()
    },
    handleDialogOpen(form, { showLoading, hideLoading, close, set }) {
      if (this.updateDeptId !== -1) {
        // update mode
        showLoading()
        getDeptInfo({ departmentId: this.updateDeptId })
          .then(res => {
            const { department, parentDepartment } = res.data
            department.parentNode = {
              id: parentDepartment ? department.parentId : -1,
              name: parentDepartment ? parentDepartment.name : '一级菜单',
              data: this.dialogTreeList
            }
            // merge
            for (const fk in form) {
              if (department[fk]) {
                form[fk] = department[fk]
              }
            }

            hideLoading()
          })
          .catch(() => {
            close()
          })
      }
    },
    handleFormSubmit(data, { close, done }) {
      const { parentNode } = data
      data.parentId = parentNode.id
      delete data.parentNode

      let req = null

      if (this.updateDeptId === -1) {
        // create
        req = createDept(data)
      } else {
        data.id = this.updateDeptId
        req = updateDept(data)
      }
      req
        .then(_ => {
          // 刷新pane
          this.refresh()
          close()
        })
        .catch(() => {
          done()
        })
    },
    openDialog(updateDeptId = -1) {
      this.updateDeptId = updateDeptId
      this.$refs.formDialog.open({
        title: '编辑部门',
        on: {
          open: this.handleDialogOpen,
          submit: this.handleFormSubmit
        },
        items: [
          {
            label: '部门名称',
            value: '',
            prop: 'name',
            rules: {
              required: true,
              message: '请输入部门名称',
              trigger: 'blur'
            },
            component: {
              name: 'el-input',
              attrs: {
                placeholder: '请输入部门名称'
              }
            }
          },
          {
            label: '上级部门',
            prop: 'parentNode',
            value: { id: undefined, name: '', data: this.dialogTreeList },
            rules: {
              required: true,
              trigger: 'blur',
              validator: (rule, value, callback) => {
                if (!value.id || !isNumber(value.id)) {
                  callback(new Error('请选择上级节点'))
                } else {
                  callback()
                }
              }
            },
            component: 'slot-parent-node-name'
          },
          {
            label: '排序号',
            prop: 'orderNum',
            value: 255,
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
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dept-tree-pane-container {
  height: 100%;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  border-right: 1px solid #e8e8e8;
  margin-right: 10px;
  padding-right: 10px;

  .tree-container {
    flex: 1;
    overflow: auto;
  }

  .header-container {
    margin-bottom: 5px;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    -webkit-box-align: center;
    height: 40px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1px;

    .title {
      flex: 1;
      margin-left: 5px;
    }

    .op-container {
      display: flex;
      display: -webkit-flex;
      align-items: center;
      -webkit-box-align: center;

      i {
        font-size: 18px;
        font-weight: 500;
        color: black;
        padding: 5px;
        cursor: pointer;

        &:hover {
          background-color: #e2e2e2;
        }
      }

      span {
        margin-left: 6px;
      }
    }
  }
}
</style>

<style lang="scss">
.dept-tree-pane-container {
  .tree-container {
    .el-tree-node__content {
      height: 36px !important;
      font-weight: 500;
    }
  }
}
</style>
