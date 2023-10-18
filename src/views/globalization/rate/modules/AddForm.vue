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
        <a-form-item label="国家" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['country', {rules: [{required: true, min: 1, message: '请输入国家'}]}]"
          />
        </a-form-item>
        <a-form-item label="货币简称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['currency', {rules: [{required: true, min: 1, message: '请输入货币简称'}]}]"
          />
        </a-form-item>
        <a-form-item label="汇率" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="例如: 1.11, 0.37 等">
          <a-input-number
            :step="0.01"
            :min="0"
            v-decorator="['rate', {rules: [{required: true, message: '请输入汇率'}]}]"
          />
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

import * as Api from '@/api/globalization/rate'

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
      this.title = '新增语言'
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
