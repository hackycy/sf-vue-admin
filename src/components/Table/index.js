import styles from './index.module.scss'
import { Table as T } from 'element-ui/'

/**
 * Common Table
 */
export default {
  data() {
    return {
      localLoading: false,
      localDataTotal: 0,
      localPagination: {
        page: 1,
        limit: 10
      },
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
    if (this.showPagination) {
      this.localPagination = Object.assign({}, this.localPagination, { page: this.currentPage, limit: this.pageSize })
    } else {
      this.loadData()
    }
  },
  watch: {
    'localPagination': function(o) {
      this.loadData(o)
    }
  },
  methods: {
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     */
    loadData(pagination) {
      this.localLoading = true
      const parameter = { page: pagination && pagination.page, limit: pagination && pagination.limit }

      // props中的dataRequest必须返回一个Promise，且返回的数据结构需要满足 { list, pagination: { total } }
      const result = this.dataRequest(parameter)
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        result.then(res => {
          this.localDataSource = res.list

          if (this.showPagination) {
            this.localDataTotal = res.pagination.total
          }
          this.localLoading = false
        }).catch(e => {
          this.localLoading = false
        })
      }
    },
    onSizeChange(size) {
      this.localPagination = Object.assign({}, this.localPagination, { limit: size })
    },
    onCurrentChange(current) {
      this.localPagination = Object.assign({}, this.localPagination, { page: current })
    },
    getTable() {
      return this.$refs.table
    }
  },
  render() {
    let tableProps = {}
    Object.keys(T.props).forEach(k => {
      this[k] && (tableProps[k] = this[k])
      return tableProps[k]
    })
    // 合并默认配置，统一样式，页面也可单独定制
    tableProps = Object.assign({
      size: 'small',
      headerCellStyle: {
        backgroundColor: '#ebeef4'
      },
      border: true
    }, tableProps, { data: this.localDataSource })

    // 分页Props与默认配置合并，统一样式，页面也可单独定制
    const paginationProps = Object.assign({}, {
      pageSizes: [10, 20, 50, 100],
      background: true,
      layout: 'total, sizes, prev, pager, next'
    }, {
      pageSizes: this.pageSizes,
      pageSize: this.pageSize,
      currentPage: this.currentPage,
      total: this.localDataTotal
    })
    return (
      <div class={styles['sf-table-wrapper']}>
        <div class={styles['sf-table-content']}>
          <el-table {...{ props: { ...tableProps }, ref: 'table', directives: [{ name: 'loading', value: this.localLoading }] }}>
            {Object.keys(this.$slots).map(name => (this.$slots[name]))}
          </el-table>
        </div>
        { this.showPagination ? (<div class={styles['sf-table-pagination']}>
          <el-pagination {...{
            props: { ...paginationProps },
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
