<template>
  <a-modal
    :title="title"
    :width="720"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="套餐名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['plan_name', {rules: [{required: true, min: 0, message: '请输入套餐名称'}]}]"
          />
        </a-form-item>
        <a-form-item label="充值金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['money', {rules: [{required: true, min: 0, message: '请输入充值金额'}]}]"
          />
        </a-form-item>
        <a-form-item label="赠送金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['gift_money', {rules: [{required: true, min: 0, message: '请输入赠送金额'}]}]"
          />
        </a-form-item>
        <a-form-item label="充值类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['cateid', {initialValue: 1, rules: [{required: true}]}]">
<!--            <a-radio :value="0">全部</a-radio>-->
            <a-radio :value="1">现金</a-radio>
            <a-radio :value="2">USDT</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="数字越小越靠前">
          <a-input-number
            :min="0"
            v-decorator="['sort', {initialValue: 100, rules: [{required: true, message: '请输入至少1个数字'}]}]"
          />
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">正常</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import * as Api from '@/api/market/recharge/plan'

export default {
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
      form: this.$form.createForm(this)

    }
  },
  methods: {

    /**
     * 显示对话框
     */
    add () {
      this.title = '新增充值金额设置'
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
      Api.add({ form: values })
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
