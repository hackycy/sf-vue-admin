import { cloneDeep, merge, isFunction, isBoolean } from 'lodash'
import { renderVNode } from '@/utils/vnode'

export default {
  provide() {
    return {
      form: this.form
    }
  },
  data() {
    return {
      visible: false,
      saving: false,
      loading: false,
      form: {},
      conf: {
        title: 'FormDialog',
        width: '50%',
        formProps: {
          size: 'medium',
          'label-width': '80px',
          'label-position': 'right'
        },
        on: {
          open: null,
          submit: null,
          error: null,
          close: null
        },
        dialogProps: {
          'close-on-click-modal': false,
          'append-to-body': true,
          center: true
        },
        op: {
          saveButtonText: '保存',
          cancelButtonText: '取消'
        },
        /**
         * example
         * {
         *    label: '',
         *    prop: '',
         *    hidden: Boolean, Function
         *    rules: {}, // 校验规则
         *    value: '', // 表单默认值
         *    span: 24, // col
         *    component: {
         *      // 等同于 https://cn.vuejs.org/v2/guide/render-function.html#createElement-参数
         *    }
         * }
         */
        items: []
      }
    }
  },
  methods: {
    open(options) {
      this.visible = true
      return this._create(options)
    },
    setFormData(prop, value) {
      // Add watch
      this.$set(this.form, prop, value)
    },
    getFormData(prop) {
      return prop ? this.form[prop] : this.form
    },
    close() {
      this.visible = false
      this.saving = false
      this.clearValidate()
    },
    done() {
      this.saving = false
    },
    showLoading() {
      this.loading = true
    },
    hideLoading() {
      this.loading = false
    },
    validateField(props, callback) {
      if (this.$refs.form) {
        this.$refs.form.validateField(props, callback)
      }
    },
    validate(callback) {
      if (this.$refs.form) {
        this.$refs.form.validate(callback)
      }
    },
    resetField() {
      if (this.$refs.form) {
        this.$refs.form.resetField()
      }
    },
    clearValidate() {
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
      }
    },
    _create(options) {
      // 合并配置
      for (const name in this.conf) {
        switch (name) {
          case 'items':
            this.conf.items = cloneDeep(options.items || [])
            break
          case 'title':
          case 'width':
            options[name] && (this.conf[name] = options[name])
            break
          default:
            merge(this.conf[name], options[name])
        }
      }

      // 预设表单值
      if (options.form) {
        for (const key in options.form) {
          this.$set(this.form, key, options.form[key])
        }
      }

      // 表单默认值
      this.conf.items.forEach(e => {
        if (e.prop) {
          this.$set(this.form, e.prop, this.form[e.prop] ? this.form[e.prop] : cloneDeep(e.value))
        }
      })

      const { open } = this.conf.on

      if (open) {
        this.$nextTick(() => {
          open(this.form, {
            showLoading: this.showLoading,
            hideLoading: this.hideLoading,
            close: this.close
          })
        })
      }

      return this
    },
    _beforeClose() {
      if (this.conf.on.close) {
        this.conf.on.close({ close: this.close })
      } else {
        this.close()
      }
    },
    _onClosed() {
      // 重置form
      for (const key in this.form) {
        delete this.form[key]
      }
    },
    _submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saving = true

          const data = cloneDeep(this.form)

          const res = {
            done: this.done,
            close: this.close
          }

          const submit = this.conf.on.submit

          if (isFunction(submit)) {
            submit(data, res)
          } else {
            console.error('Submit Callback Not Found')
          }
        } else {
          // error hook
          const error = this.conf.on.error
          if (isFunction(error)) {
            error()
          }
        }
      })
    },
    // ------ render ------
    parseHidden({ value, scope }) {
      if (isBoolean(value)) {
        return value
      } else if (isFunction(value)) {
        return value({ scope })
      }
      return false
    },
    /**
     * 渲染表单
     */
    renderForm() {
      const { formProps, items } = this.conf
      return (
        <el-form
          ref='form'
          {
            ...{
              props: {
                ...formProps,
                disabled: this.saving,
                model: this.form
              }
            }
          }
        >
          <el-row gutter={10} { ...{ directives: [{ name: 'loading', value: this.loading }] } }>
            {/* 渲染表单列表 */}
            {items.map(e => {
              return (
                <el-row
                  key={`form-item-${e.prop}`}
                  {
                    ...{
                      props: {
                        span: e.span || 24
                      }
                    }
                  }
                >
                  {e.component && !this.parseHidden({ value: e.hidden, scope: this.form }) && (
                    <el-form-item { ...{ props: { label: e.label, prop: e.prop, rules: e.rules }} }>
                      {/* 将函数this绑定当前组件树的根 Vue 实例。如果当前实例没有父实例，此实例将会是其自己。 */}
                      {(renderVNode.bind(this.$root))(e.component, { scope: this.form, $scopedSlots: this.$scopedSlots, prop: e.prop })}
                    </el-form-item>
                  )}
                </el-row>
              )
            })}
          </el-row>
        </el-form>
      )
    },
    /**
     * 渲染底部按钮
     */
    renderFooter() {
      return (
        <el-row type='flex' justify='end'>
          <el-button { ...{ props: { size: 'mini' }, on: { click: () => { this._beforeClose() } }} }>
            取 消
          </el-button>
          <el-button { ...{ props: { size: 'mini', type: 'primary', loading: this.saving }, on: { click: () => { this._submit() } }} }>
            确 定
          </el-button>
        </el-row>
      )
    }
  },
  /**
   * render
   */
  render() {
    const { title, width, dialogProps } = this.conf
    return (
      <el-dialog
        title={title}
        width={width}
        visible={this.visible}
        {
          ...{
            props: {
              ...dialogProps,
              'before-close': this._beforeClose
            },
            on: {
              'update:visible': (v) => { this.visible = v },
              closed: this._onClosed
            },
            directives: [{ name: 'el-drag-dialog' }]
          }
        }
      >
        {this.renderForm()}
        {/* footer */}
        <div slot='footer'>
          {this.renderFooter()}
        </div>
      </el-dialog>
    )
  }
}
