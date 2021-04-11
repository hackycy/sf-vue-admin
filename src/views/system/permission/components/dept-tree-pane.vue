<template>
  <div class="dept-tree-pane-container">
    <div class="header-container">
      <div class="title">组织架构</div>
      <div class="op-container">
        <el-tooltip effect="dark" content="点击刷新" placement="top-start">
          <i class="el-icon-refresh-right" @click="refresh" />
        </el-tooltip>
        <el-tooltip effect="dark" content="点击开启拖拽排序" placement="top-start">
          <i class="el-icon-s-operation" @click="() => { isDrag = true }" />
        </el-tooltip>
        <span v-if="isDrag">
          <warning-confirm-button
            text="保存"
            content="确定保存当前更改的操作？"
            @confirm="handleSave"
          />
          <el-button size="small" type="text" @click="handleCancel">取消</el-button>
        </span>
      </div>
    </div>
    <div v-loading="loading" class="tree-container">
      <el-tree
        style="height: 100%;"
        :props="{ children: 'children', label: 'label' }"
        :data="nodeList"
        highlight-current
        node-key="id"
        :expand-on-click-node="false"
        default-expand-all
        :draggable="isDrag"
        @node-click="handleNodeClick"
        @node-drop="handleNodeDrop"
      />
    </div>
  </div>
</template>

<script>
import { findIndex, isNumber } from 'lodash'
import WarningConfirmButton from '@/components/WarningConfirmButton'
import PermissionMixin from '../../mixin/permission'
import { getDeptList, moveDeptList } from '@/api/sys/dept'

export default {
  name: 'SysDeptTreePane',
  components: {
    WarningConfirmButton
  },
  mixins: [PermissionMixin],
  data() {
    return {
      isDrag: false,
      loading: false,
      depts: [],
      drops: []
    }
  },
  computed: {
    nodeList() {
      return this.filterDeptToTree(this.depts, null)
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
      return this.depts
    },
    async refresh() {
      this.loading = true
      const { data } = await getDeptList()
      this.depts = data || []
      this.loading = false
    },
    async handleSave({ done, close }) {
      // diff 差异
      const data = this.drops.filter(e => {
        const index = findIndex(this.depts, (o) => o.id === e.id)
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
        await moveDeptList({ depts: data })
        done()
        close()
        this.isDrag = false
        this.refresh()
      } catch {
        done()
      }
    },
    handleCancel() {
      if (this.drops && this.drops.length > 0) {
        // 清空并且重新拉去数据刷新内容
        this.drops = []
        this.refresh()
      }
      this.isDrag = false
    },
    handleNodeClick(data, node, ref) {
      this.$emit('node-change', data, node, ref)
    },
    handleNodeDrop(before, after, position, _) {
      // 当拖拽类型不为inner,说明只是同级或者跨级排序，只需要寻找目标节点的父ID，获取其对象以及所有的子节点，并为子节点设置当前对象的ID为父ID即可
      // 当拖拽类型为inner，说明拖拽节点成为了目标节点的子节点，只需要获取目标节点对象即可
      // 设置父ID,当level为1说明在第一级，pid为空
      const { data: dept } = before
      const { data: parentDept } = position === 'inner' ? after : after.parent
      // find value
      const id = dept.id
      const parentId = position === 'inner' ? parentDept.id : (after.level === 1 ? undefined : parentDept.id)
      // 是否已存在
      const index = findIndex(this.drops, (o) => o.id === dept.id)
      if (index >= 0) {
        this.drops[index].parentId = parentId
      } else {
        // not exist
        this.drops.push({ id: id, parentId: parentId })
      }
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
  .tree-container{
    .el-tree-node__content {
      height: 36px !important;
      font-weight: 500;
    }
  }
}
</style>
