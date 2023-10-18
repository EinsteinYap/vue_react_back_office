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
        <a-form-item label="打折标题" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-input
            v-decorator="['title', {rules: [{required: true,message: '请输入打折标题'}]}]"
          />
        </a-form-item>
        <a-form-item label="折扣率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            :max="100"
            v-decorator="['discount_rate', {rules: [{required: true, message: '请输入折扣率'}]}]"
          />
        </a-form-item>
        <a-form-item label="选择产品" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <SelectGoods
            :defaultList="record.goods ? [record.goods] : []"
            :multiple="false"
            v-decorator="['goods_id', { rules: [{ required: true, message: '请选择指定的产品' }] }]"
          />
        </a-form-item>
        <a-form-item label="一口价" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['price', {rules: [{required: true, message: '请输入一口价'}]}]"
          />
        </a-form-item>
        <a-form-item label="限购库存" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['stock_num', {rules: [{required: true, message: '请输入库存'}]}]"
          />
        </a-form-item>
        <a-form-item label="限购数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['limit_num', {rules: [{required: true, message: '请输入限购数量'}]}]"
          />
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
        <a-form-item label="到期时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker format="YYYY-MM-DD" v-decorator="['end_time']" />
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import * as Api from '@/api/sales/discount'
import { SelectGoods } from '@/components'
import moment from 'moment/moment'

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
  methods: {

    /**
     * 显示对话框
     */
    edit (record) {
      // 显示窗口
      this.title = '编辑打折活动'
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
        console.log(this.record)
        const data = _.pick(this.record, [
          'discount_rate',
          'goods_id',
          'price',
          'stock_num',
          'limit_num',
          'status',
          'end_time',
          'is_bonus',
          'is_spread',
          'title'
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
      const postData = { ...values }
      postData.end_time = moment(postData.end_time).format('YYYY-MM-DD')
      Api.edit({ form: postData, id: this.record.id })
        .then((result) => {
          console.log('result', result)
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
