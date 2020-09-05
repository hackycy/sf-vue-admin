<template>
  <div class="menu-container">
    <div class="menu-header">
      <el-button size="mini" @click="handleRefresh">刷新</el-button>
      <el-button size="mini" type="primary" @click="handleAdd">新增</el-button>
    </div>
    <div class="menu-content">
      <el-table
        v-loading="isLoading"
        :data="menuData"
        size="small"
        style="width: 100%;"
        :header-cell-style="{ backgroundColor: '#ebeef4' }"
        row-key="id"
        border
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="name" label="名称" width="240">
          <template slot-scope="scope">
            <span style="margin-right: 16px">{{ scope.row.name }}</span>
            <el-tag
              v-if="!scope.row.isShow && scope.row.type !== 2"
              type="danger"
              effect="dark"
              size="small"
            >隐藏</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" width="60" align="center">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.icon" :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="80" align="center">
          <template slot-scope="scope">
            <el-tag type="small" effect="dark">{{ getMenuType(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="router" label="节点路由" align="center" width="240" />
        <el-table-column prop="keepalive" label="路由缓存" width="80" align="center">
          <template slot-scope="scope">
            <i v-if="scope.row.keepalive && scope.row.type === 1" class="el-icon-check" />
          </template>
        </el-table-column>
        <el-table-column prop="viewPath" label="文件路径" align="center" width="280" />
        <el-table-column prop="perms" label="权限" header-align="center" width="300">
          <template slot-scope="scope">
            <el-tag
              v-for="i in splitPerms(scope.row.perms)"
              :key="i"
              effect="dark"
              size="mini"
              class="tag-perm-item"
            >{{ i }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序号" width="80" align="center" />
        <el-table-column prop="updateTime" label="更新时间" width="180" align="center" />
        <el-table-column prop="address" label="操作" width="150" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- dialog -->
    <el-dialog
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :title="alertTitle"
      :visible.sync="editerDialogVisible"
      center
      size="mini"
      @closed="handleDialogClosed"
    >
      <el-form
        ref="menuForm"
        v-loading="isDialogLoading"
        :model="menuForm"
        :rules="getMenuTypeRulues()"
      >
        <el-form-item label="菜单类型" label-width="80px">
          <el-radio-group v-model="menuForm.type">
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
              node-key="pid"
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
        <el-form-item v-if="menuForm.type !== 2" label="节点路由" label-width="80px" prop="router">
          <el-input v-model="menuForm.router" placeholder="请输入节点路由" />
        </el-form-item>
        <el-form-item v-if="menuForm.type === 2" label="权限" label-width="80px" prop="perms">
          <el-cascader
            v-model="menuForm.perms"
            separator=":"
            style="width: 100%;"
            :options="perms.options"
            :props="perms.props"
            clearable
          />
        </el-form-item>
        <el-form-item v-if="menuForm.type !== 2" label="节点图标" label-width="80px" prop="icon">
          <el-select v-model="menuForm.icon" placeholder="请选择图标" style="width: 100%;">
            <el-option v-for="item in svgIcons" :key="item" :label="item" :value="item">
              <span style="float: left; font-size: 16px; color: #444444;">
                <svg-icon :icon-class="item" class-name="select-icon" />
              </span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="menuForm.type === 1" label="文件路径" label-width="80px" prop="viewPath">
          <el-select v-model="menuForm.viewPath" placeholder="请选择文件路径" style="width: 100%;">
            <el-option v-for="item in viewFiles" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="menuForm.type !== 2" label="是否显示" label-width="80px">
          <el-switch v-model="menuForm.isShow" />
        </el-form-item>
        <el-form-item v-if="menuForm.type === 1" label="开启缓存" label-width="80px">
          <el-switch v-model="menuForm.keepalive" />
        </el-form-item>
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
          <el-button size="mini" @click="editerDialogVisible = false">取消</el-button>
          <el-button type="primary" size="mini" :loading="isSaveLoading" @click="handleSaveMenu">保存</el-button>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as _ from 'lodash'
import svgIcons from './svg-icons'
import viewFiles from './view-path'

/**
 * 遍历获取$service下定义的权限，需要权限的Api必须定义Service且需要使用@Permission定义权限
 */
function flatPerms(obj) {
  let list = []
  _.keys(obj).forEach(i => {
    const { permission } = obj[i]
    if (permission) {
      list = _.concat(list, [Object.values(permission)].flat())
    } else {
      const tmp = flatPerms(obj[i])
      if (tmp && tmp.length > 0) {
        list = _.concat(list, flatPerms(obj[i]))
      }
    }
  })
  return list
}

/**
 * 处理权限
 */
function filterPerms(index, arr, op) {
  const key = arr[index]
  const i = _.findIndex(op, (e) => e.label === key)
  if (i >= 0) {
    // 存在则继续遍历
    filterPerms(index + 1, arr, op[i].children)
  } else {
    const isLast = index === arr.length - 1 // 是否为最后一个
    const value = {
      value: key,
      label: key,
      children: isLast ? null : []
    }
    op.push(value)
    if (!isLast) {
      filterPerms(index + 1, arr, op[op.length - 1].children || [])
    }
  }
}

/**
 * 处理菜单数据渲染至表格
 */
function filterMenuToTable(menus, parentMenu) {
  const res = []
  menus.forEach(menu => {
    // 根级别菜单渲染
    let realMenu
    if (!parentMenu && !menu.parentId && menu.type === 1) {
      // 根菜单
      realMenu = { ...menu }
    } else if (!parentMenu && !menu.parentId && menu.type === 0) {
      // 根目录
      const childMenu = filterMenuToTable(menus, menu)
      realMenu = { ...menu }
      realMenu.children = childMenu
    } else if (parentMenu && parentMenu.id === menu.parentId && menu.type === 1) {
      // 子菜单下继续找是否有子菜单
      const childMenu = filterMenuToTable(menus, menu)
      realMenu = { ...menu }
      realMenu.children = childMenu
    } else if (parentMenu && parentMenu.id === menu.parentId && menu.type === 0) {
      // 如果还是目录，继续递归
      const childMenu = filterMenuToTable(menus, menu)
      realMenu = { ...menu }
      realMenu.children = childMenu
    } else if (parentMenu && parentMenu.id === menu.parentId && menu.type === 2) {
      realMenu = { ...menu }
    }
    // add curent route
    if (realMenu) {
      realMenu.pid = menu.id
      res.push(realMenu)
    }
  })
  return res
}

/**
 * 渲染菜单至树形控件
 */
function filterMenuToTree(menus, parentMenu) {
  const res = []
  menus.forEach(menu => {
    let node
    if (menu.type === 2) {
      // 权限直接return
      return
    }
    if (!parentMenu && !menu.parentId && menu.type === 1) {
      // 根菜单
      node = { label: menu.name }
    } else if (!parentMenu && !menu.parentId && menu.type === 0) {
      // 根目录
      const childNode = filterMenuToTree(menus, menu)
      node = { label: menu.name }
      node.children = childNode
    } else if (parentMenu && parentMenu.id === menu.parentId && menu.type === 1) {
      // 子菜单则停止
      node = { label: menu.name }
    } else if (parentMenu && parentMenu.id === menu.parentId && menu.type === 0) {
      // 如果还是目录，继续递归
      const childNode = filterMenuToTree(menus, menu)
      node = { label: menu.name }
      node.children = childNode
    }

    if (node) {
      node.pid = menu.id
      res.push(node)
    }
  })
  return res
}

export default {
  name: 'SystemPermissionMenu',
  data() {
    return {
      isLoading: true,
      dialogMode: 0, // 0为新增，1为编辑
      svgIcons,
      viewFiles,
      menuData: [],
      editerDialogVisible: false,
      isSaveLoading: false,
      isDialogLoading: false,
      menuForm: {
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
      },
      menuFormRules: {
        catalog: {
          name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
          router: [{ required: true, message: '请输入节点路由', trigger: 'blur' }],
          parentNodeName: [{ required: true, message: '请输入节点路由', trigger: 'blur' }]
        },
        menu: {
          name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
          router: [{ required: true, message: '请输入节点路由', trigger: 'blur' }],
          parentNodeName: [{ required: true, message: '请输入节点路由', trigger: 'blur' }],
          viewPath: [{ required: true, message: '请选择文件地址', trigger: 'blur' }]
        },
        perm: {
          parentNodeName: [{ required: true, message: '请输入节点路由', trigger: 'blur' }],
          name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
          perms: [{ required: true, message: '请选择权限', trigger: 'blur' }]
        }
      },
      formLabelWidth: '120px',
      perms: {
        // 权限
        props: { multiple: true },
        options: []
      },
      menuTree: {
        data: [],
        props: {
          children: 'children',
          label: 'label'
        }
      }
    }
  },
  computed: {
    alertTitle: function() {
      return this.dialogMode === 0 ? '新增' : '编辑'
    }
  },
  created() {
    this.list()
    this.initPerms()
  },
  methods: {
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
    async list() {
      const { data } = await this.$service.sys.menu.list()
      this.menuData = filterMenuToTable(data, null)
      const parentNode = { pid: -1, label: '一级菜单' }
      parentNode.children = filterMenuToTree(data, null)
      this.menuTree.data.push(parentNode)
      this.isLoading = false
    },
    getMenuType(type) {
      switch (type) {
        case 0:
          return '目录'
        case 1:
          return '菜单'
        case 2:
          return '权限'
      }
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
        console.log(permsArray)
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
    refreshMenu() {
      this.menuTree.data = []
      this.menuData = []
      this.list()
    },
    resetMenuFormData() {
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
      if (this.$refs.menuForm) {
        this.$refs.menuForm.resetFields()
      }
    },
    handleMenuNodeClick(data) {
      this.menuForm.parentId = data.pid
      this.menuForm.parentNodeName = data.label
    },
    handleDialogClosed() {
      if (this.isDialogLoading) {
        this.isDialogLoading = false
      }
      // 重制表单
      this.resetMenuFormData()
    },
    handleRefresh(event) {
      this.isLoading = true
      this.refreshMenu()
    },
    handleAdd(event) {
      this.dialogMode = 0
      this.editerDialogVisible = true
    },
    async handleEdit(item) {
      // edit
      this.dialogMode = 1
      this.editerDialogVisible = true
      this.isDialogLoading = true
      try {
        const { data } = await this.$service.sys.menu.info({ menuId: item.id })
        if (data) {
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
        }
      } catch (e) {
        this.editerDialogVisible = false
        this.$message({
          type: 'warning',
          message: '获取菜单信息失败'
        })
      }
    },
    handleDelete(item) {
      // delete
      this.$confirm('此操作将永久删除且无法还原, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { code } = await this.$service.sys.menu.delete({ menuId: item.id })
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.list()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
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
          }
          this.isSaveLoading = true
          try {
            let res
            if (this.dialogMode === 1) {
              res = await this.$service.sys.menu.update(postData)
            } else if (this.dialogMode === 0) {
              res = await this.$service.sys.menu.add(postData)
            }
            const { data } = res
            this.isSaveLoading = false
            if (data) {
              this.list()
              this.editerDialogVisible = false
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            }
          } catch (e) {
            this.isSaveLoading = false
          }
        } else {
          this.$message({
            message: '请正确填写内容',
            type: 'warning'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-container {
  padding: 15px;

  .menu-header {
    margin-bottom: 15px;
  }

  .menu-content {
    .tag-perm-item {
      margin-right: 4px;
    }
  }

  .select-icon {
    font-size: 100px;
  }
}
</style>
