<template>
  <div class="dept-tree-pane-container">
    <div class="header-container">
      <div class="title">组织架构</div>
      <div class="op-container">
        <el-tooltip effect="dark" content="点击刷新" placement="top-start">
          <i class="el-icon-refresh-right" @click="refresh" />
        </el-tooltip>
        <el-tooltip effect="dark" content="点击开启拖拽更新" placement="top-start">
          <i class="el-icon-s-operation" @click="handleOpenDrag" />
        </el-tooltip>
        <span v-if="isDrag">
          <warning-confirm-button
            text="保存"
            content="确定保存当前更改的操作？"
          />
          <el-button size="small" type="text" @click="handleCancel">取消</el-button>
        </span>
      </div>
    </div>
    <div v-loading="loading" class="tree-container">
      <el-tree
        style="height: 100%;"
        :props="{ children: 'children', label: 'label' }"
        :data="depts"
        highlight-current
        node-key="id"
        :expand-on-click-node="false"
        default-expand-all
        :draggable="isDrag"
      />
    </div>
  </div>
</template>

<script>
import WarningConfirmButton from '@/components/WarningConfirmButton'
import PermissionMixin from '../../mixin/permission'
import { getDeptList } from '@/api/sys/dept'

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
      depts: []
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      this.loading = true
      const { data } = await getDeptList()
      if (data) {
        this.depts = this.filterDeptToTree(data, null)
      }
      this.loading = false
    },
    getDeptList() {
      return this.depts
    },
    handleOpenDrag() {
      this.isDrag = true
    },
    handleSave() {},
    handleCancel() {
      this.isDrag = false
      this.refresh()
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
  border-right: 1px solid #f5f5f5;
  margin-right: 5px;
  padding-right: 5px;

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
