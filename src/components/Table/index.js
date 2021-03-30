import styles from './index.module.scss'
import { Table as T } from 'element-ui/'

/**
 * Common Table
 */
export default {
  data() {
    return {
      localDataSource: []
    }
  },
  props: Object.assign({}, T.props, {
    dataRequest: {
      type: Function,
      required: true
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    }
  }),
  render() {
    return (
      <div class={ styles['sf-table-wrapper'] }>
        a
      </div>
    )
  }
}
