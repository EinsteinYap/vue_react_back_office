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
		  <a-form-item label="规则" :labelCol="labelCol" :wrapperCol="wrapperCol">
		    <a-radio-group v-decorator="['cateid', {initialValue: 1, rules: [{required: true}]}]">
		      <a-radio :value="1">随机</a-radio>
		      <a-radio :value="2">固定</a-radio>
		    </a-radio-group>
		  </a-form-item>
		  <a-form-item v-if="form.getFieldValue('cateid') == 1" label="随机金额范围" :labelCol="labelCol" :wrapperCol="wrapperCol">
		    <a-input-number
		      :min="0"
		      v-decorator="['range_min', {rules: [{required: true, message: ''}]}]"
		    />
		    ~
		    <a-input-number
		      :min="0"
		      v-decorator="['range_max', {rules: [{required: true, message: ''}]}]"
		    />
		  </a-form-item>
        <a-form-item v-if="form.getFieldValue('cateid') == 2" label="单个红包金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['amount', {rules: [{required: true, message: '请输入单个红包金额'}]}]"
          />
        </a-form-item>
        <a-form-item label="红包个数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['total_num', {rules: [{required: true, message: '请输入总个数'}]}]"
          />
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="0">关闭</a-radio>
            <a-radio :value="1">正常</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="到期时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['end_time']" />
        </a-form-item>


      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import * as Api from '@/api/sales/paper'
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
      this.title = '新增红包'
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
