<template>
  <a-modal
    :title="title"
    :width="920"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="砍价标题" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-input
            v-decorator="['title', {rules: [{required: true,message: '请输入砍价标题'}]}]"
          />
        </a-form-item>
        <a-form-item label="选择产品" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <SelectGoods
            :defaultList="record.goods ? [record.goods] : []"
            :multiple="false"
            v-decorator="['goods_id', { rules: [{ required: true, message: '请选择指定的产品' }] }]"
          />
        </a-form-item>
        <a-form-item label="有效期" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="单位: 小时">
          <a-input
            :min="0"
            v-decorator="['expiryt_time', {rules: [{required: true, message: '请输入有效期'}]}]"
          />
        </a-form-item>
        <a-form-item label="砍价底价" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-input-number
            :min="0"
            v-decorator="['floor_price', {rules: [{required: true,message: '请输入砍价底价'}]}]"
          />
        </a-form-item>
        <a-form-item label="帮砍人数" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-input-number
            :min="0"
            v-decorator="['peoples', {rules: [{required: true, message: '请输入帮砍人数'}]}]"
          />
        </a-form-item>
        <a-form-item label="库存数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['stock_num', {rules: [{required: true, message: '请输入库存数量'}]}]"
          />
        </a-form-item>
        <a-form-item label="限购数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['limit_num', {rules: [{required: true, message: '请输入限购数量'}]}]"
          />
        </a-form-item>
        <a-form-item label="虚拟销量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['initial_sales', {rules: [{required: true, message: '请输入虚拟销量'}]}]"
          />
        </a-form-item>
        <a-form-item label="到期时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['end_time']" />
        </a-form-item>
        <a-form-item label="自砍一刀" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['is_self_cut', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">允许</a-radio>
            <a-radio :value="0">禁止</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="底价购买" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['is_floor_buy', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">允许</a-radio>
            <a-radio :value="0">禁止</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否有推荐奖励" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['is_bonus', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否有分红奖励" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['is_spread', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="砍价助力语" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea :autoSize="{ minRows: 4, maxRows: 6 }" v-decorator="['prompt_words']" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import * as Api from '@/api/sales/bargain'
import { SelectGoods } from '@/components'
import moment from 'moment/moment'
let rid = 1
export default {
  components: { SelectGoods },
  props: {
  },
  data () {
    return {
      formItemLayout: {
        labelCol: {
          xs: { span: 23 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 23 },
          sm: { span: 19 }
        }
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 19, offset: 5 }
        }
      },
      // 对话框标题
      title: '',
      // 标签布局属性
      labelCol: {
        span: 7
      },
      // 输入框布局属性
      wrapperCol: {
        span: 13
      },
      // modal(对话框)是否可见
      visible: false,
      // modal(对话框)确定按钮 loading
      confirmLoading: false,
      // 当前表单元素
      // form: this.$form.createForm(this),

      // 当前记录
      record: {}
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
    this.form.getFieldDecorator('ruleInput', { initialValue: [], preserve: true })
    // this.form.getFieldDecorator('rule', { initialValue: [], preserve: true });
  },
  methods: {

    removeRule (k) {
      const { form } = this
      // can use data-binding to get
      const keys = form.getFieldValue('ruleInput')
      // We need at least one passenger
      if (keys.length === 1) {
        return
      }

      // can use data-binding to set
      form.setFieldsValue({
        ruleInput: keys.filter(key => key !== k)
      })
    },

    addRule () {
      const { form } = this
      const keys = form.getFieldValue('ruleInput')
      rid = keys.length

      console.log(rid)

      const nextKeys = keys.concat(rid++)
      console.log('nextKeys', nextKeys)
      form.setFieldsValue({
        ruleInput: nextKeys
      })
    },
    /**
     * 显示对话框
     */
    edit (record) {
      // 显示窗口
      this.title = '编辑砍价活动'
      this.visible = true
      // 当前语言详情
      // console.log('record', record)
      // record.betweenTime = [moment(record.start_time), moment(record.end_time)]
      this.record = record
      // 设置默认值
      this.setFieldsValue()
    },

    /**
     * 设置默认值
     */
    setFieldsValue () {
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        const data = _.pick(this.record, [
          'goods_id',
          'expiryt_time',
          'floor_price',
          'peoples',
          'stock_num',
          'limit_num',
          'initial_sales',
          'end_time',
          'is_self_cut',
          'is_floor_buy',
          'status',
          'prompt_words',
          'is_bonus',
          'is_spread',
          'title'
        ])
        setFieldsValue(data)
        setFieldsValue({
          ruleInput: data.rule.map((item, index) => index)
        })
      })
    },
    /**
     * 确认按钮
     */
    handleSubmit (e) {
      e.preventDefault()
      // 表单验证
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        // 提交到后端api
        !errors && this.onFormSubmit(values)
      })
    },

    /**
     * 关闭对话框事件
     */
    handleCancel () {
      this.visible = false
      this.form.resetFields()
    },

    /**
    * 提交到后端api
    */
    onFormSubmit (values) {
      this.confirmLoading = true
      const postData = { ...values }
      postData.end_time = moment(postData.end_time).format('YYYY-MM-DD HH:mm:ss')
      console.log('postData', postData)
      Api.edit({ form: postData, id: this.record.id })
        .then((result) => {
          // 显示成功
          this.$message.success(result.message, 1.5)
          // 关闭对话框事件
          this.handleCancel()
          // 通知父端组件提交完成了
          this.$emit('handleSubmit', values)
        })
        .finally((result) => {
          this.confirmLoading = false
        })
    }

  }
}
</script>
