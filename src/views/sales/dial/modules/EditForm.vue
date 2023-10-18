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
        <a-form-item label="奖项名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['cname', {rules: [{required: true, min: 0, message: '请输入奖项名称'}]}]"
          />
        </a-form-item>
        <a-form-item label="奖项类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['cateid', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">现金</a-radio>
            <a-radio :value="2">优惠券</a-radio>
            <a-radio :value="3">产品</a-radio>
            <a-radio :value="4">谢谢惠顾</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="奖值" v-if="form.getFieldValue('cateid') == 3" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <SelectGoods
            :multiple="false"
            :defaultList="record.value_item ? [record.value_item] : []"
            v-decorator="['value', { rules: [{ required: true, message: '请选择指定的产品' }] }]"
          />
        </a-form-item>
        <a-form-item label="优惠券" v-else-if="form.getFieldValue('cateid') ==2 " :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select :defaultValue="record.value_item.name" v-decorator="['value', {  rules: [{ required: true, message: '请选择指定的产品' }] }]">
            <a-select-option :value="item.coupon_id" v-for="item in couponList" :key="item.coupon_id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-else label="奖值" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['value', {rules: [{required: true, min: 0, message: '请输入奖值'}]}]"
          />
        </a-form-item>
        <a-form-item label="中奖比例" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="0-100%">
          <a-input-number
            :min="0"
            :max="100"
            v-decorator="['rate', {initialValue: 0, rules: [{required: true, message: '请输入至少1个数字'}]}]"
          />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import * as Api from '@/api/sales/dial'
import { SelectGoods } from '@/components'
import moment from 'moment/moment'
import * as CouponApi from '@/api/market/coupon'

export default {
  components: { SelectGoods },
  props: {
  },
  data () {
    return {
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
      form: this.$form.createForm(this),

      // 当前记录
      record: {}
    }
  },
  created () {
    // { is_gift: 1 }
    CouponApi.list({ is_gift: 1 })
      .then(response => {
        this.couponList = response.data.list.data
      })
  },
  methods: {

    /**
     * 显示对话框
     */
    edit (record) {
      // 显示窗口
      this.title = '编辑奖项'
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
        if (this.record.value) {
          this.record.value = Number(this.record.value)
        }
        const data = _.pick(this.record, [
          'cname',
          'cateid',
          'value',
          'rate',
          'value_item'
        ])
        setFieldsValue(data)
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
      if (values.cateid == 3) {
        values.value = [values.value]
      }
      Api.edit({ form: values, id: this.record.id })
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
