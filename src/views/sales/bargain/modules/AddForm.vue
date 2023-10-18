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
            v-if="visible"
            :multiple="false"
            v-decorator="['goods_id', { rules: [{ required: true, message: '请选择指定的产品' }] }]"
          />
        </a-form-item>
        <a-form-item label="有效期" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="单位: 小时">
          <a-input-number
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
            min="0"
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

import * as Api from '@/api/sales/bargain'
import { SelectGoods } from '@/components'
import moment from 'moment/moment'
const rid = 1
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
        span: 5
      },
      // 输入框布局属性
      wrapperCol: {
        span: 15
      },
      // modal(对话框)是否可见
      visible: false,
      // modal(对话框)确定按钮 loading
      confirmLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this)

    }
  },
  methods: {

    /**
     * 显示对话框
     */
    add () {
      this.title = '新增砍价活动'
      this.visible = true
    },

    /**
     * 确认按钮
     */
    handleSubmit (e) {
      e.preventDefault()
      const { form: { validateFields } } = this
      // 表单验证
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
      Api.add({ form: postData })
        .then((result) => {
           // 显示成功
          this.$message.success(result.message, 1.5)
          // 关闭对话框
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
