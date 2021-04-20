import styles from './index.module.scss'
import { Table as T } from 'element-ui/'

/**
 * Common Table
 */
export default {
  data() {
    return {
      localLoading: false,
      localPagination: Object.assign({}, {
        background: true,
        layout: 'total, sizes, prev, pager, next',
        total: 0,
        pageSizes: this.pageSizes,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }),
      localDataSource: []
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
    getTable() {
      return this.$refs.table
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

    return (
      <div class={styles['sf-table-wrapper']}>
        <div class={styles['sf-table-content']}>
          <el-table {...{ props: { ...tableProps }, on: {
            'row-click': (row, column, event) => { this.$emit('row-click', row, column, event) },
            'selection-change': (selection) => { this.$emit('selection-change', selection) },
            'row-contextmenu': (row, column, event) => { this.$emit('row-contextmenu', row, column, event) }
          },
          ref: 'table',
          directives: [{ name: 'loading', value: this.localLoading }] }}>
            {Object.keys(this.$slots).map(name => (this.$slots[name]))}
          </el-table>
        </div>
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
