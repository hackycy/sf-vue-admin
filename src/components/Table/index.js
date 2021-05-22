import styles from './index.module.scss'
import { Table as T } from 'element-ui/'
import draggable from 'vuedraggable'

/**
 * Common Table
 */
export default {
  components: {
    draggable
  },
  data() {
    return {
      tableKey: 1,
      localLoading: false,
      localPagination: Object.assign({}, {
        background: true,
        layout: 'total, sizes, prev, pager, next',
        total: 0,
        pageSizes: this.pageSizes,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }),
      localDataSource: [],
      // sort
      theaderItems: []
    }
  },
  props: Object.assign({}, T.props, {
    dataRequest: {
      type: Function,
      required: true
    },
    showPagination: {
      type: Boolean,
      default: false
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default: function() {
        return [10, 20, 50, 100]
      }
    }
  }),
  created() {
    this.initTheaderItem()
    // 加载数据
    this.loadData()
  },
  watch: {
    'localPagination.pageSize': function(s) {
      this.loadData()
    },
    'localPagination.currentPage': function(p) {
      this.loadData()
    }
  },
  methods: {
    /**
     * 手动刷新数据
     */
    refresh(init = false) {
      if (init) {
        // 重置当前页面
        this.localPagination.currentPage = 1
      }
      this.loadData()
    },
    /**
     * 获取表格绑定的数据
     */
    getData() {
      return this.localDataSource
    },
    /**
     * 获取真正的Table示例
     */
    getTable() {
      return this.$refs.table
    },
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     */
    loadData() {
      this.localLoading = true
      const params = this.showPagination ? { page: this.localPagination.currentPage, limit: this.localPagination.pageSize } : null
      const result = this.dataRequest(params)
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        result.then(res => {
          // props中的dataRequest必须返回一个Promise，且返回的数据结构需要满足 { list, pagination: { total } }
          this.localDataSource = res.list

          if (this.showPagination) {
            this.localPagination.total = res.pagination.total
          }

          this.localLoading = false
        }).catch(e => {
          // 抛出异常时也需要关闭loading
          this.localLoading = false
        })
      }
    },
    // pageSize 改变时会触发
    onSizeChange(size) {
      this.localPagination.pageSize = size
    },
    // currentPage 改变时会触发
    onCurrentChange(current) {
      this.localPagination.currentPage = current
    },
    // init header sort pane
    initTheaderItem() {
      if (this.$slots['default']) {
        this.$slots['default']
          .filter(
            vnode =>
              vnode &&
              vnode.componentOptions &&
              vnode.componentOptions.tag === 'el-table-column' &&
              vnode.componentOptions.propsData &&
              vnode.componentOptions.propsData.type !== 'selection'
          )
          .forEach(vnode => {
            this.theaderItems.push({
              prop: vnode.componentOptions.propsData.prop,
              label: vnode.componentOptions.propsData.label
            })
          })
      }
    },
    // reader sort
    renderHeaderSelectionIcon() {
      return (
        <el-popover width='300' placement='bottom-start'>
          <i slot='reference' class='el-icon-setting' />
        </el-popover>
      )
    }
  },
  render() {
    // table props 遍历
    let tableProps = {}
    Object.keys(T.props).forEach(k => {
      (this[k] !== undefined && this[k] !== null) && (tableProps[k] = this[k])
      return tableProps[k]
    })

    // 合并默认配置，统一样式，页面也可单独定制
    tableProps = Object.assign({
      size: 'small',
      headerCellStyle: {
        backgroundColor: '#ebeef4'
      }
    }, tableProps, { data: this.localDataSource })

    // table slot
    const tableColumns = (this.$slots['default'] || [])
    const tableAppend = this.$slots['append'] || ''

    return (
      <div class={styles['sf-table-wrapper']}>
        {/* header */}
        <el-row type='flex' class={styles['sf-table-header']}>
          <el-col {...{ props: { span: 22 }}}></el-col>
          <el-col {...{ props: { span: 2 }}}>
            <div class={styles['tb-option-box']}>
              {/* 刷新按钮 */}
              <i class='el-icon-refresh-right' { ...{ on: { click: this.refresh }} } />
              {/* header选择排序栏 */}
              {this.renderHeaderSelectionIcon()}
            </div>
          </el-col>
        </el-row>
        {/* table */}
        <div class={styles['sf-table-content']}>
          <el-table {...{ props: { ...tableProps }, on: {
            'row-click': (row, column, event) => { this.$emit('row-click', row, column, event) },
            'selection-change': (selection) => { this.$emit('selection-change', selection) },
            'row-contextmenu': (row, column, event) => { this.$emit('row-contextmenu', row, column, event) }
          },
          ref: 'table',
          directives: [{ name: 'loading', value: this.localLoading }] }}>
            {/* {Object.keys(this.$slots).map(name => (this.$slots[name]))} */}
            {tableColumns}
            {tableAppend}
          </el-table>
        </div>
        {/* pagination */}
        { this.showPagination ? (<div class={styles['sf-table-pagination']}>
          <el-pagination {...{
            props: { ...this.localPagination },
            on: {
              'size-change': this.onSizeChange,
              'current-change': this.onCurrentChange
            }
          }} />
        </div>) : '' }
      </div>
    )
  }
}
