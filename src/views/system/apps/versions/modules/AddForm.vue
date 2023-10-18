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
        <a-form-item label="编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['encoded', {rules: [{required: true, min: 2, message: '请输入编码'}]}]"
          />
        </a-form-item>
        <a-form-item label="版本号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['version', {rules: [{required: true, min: 2, message: '请输入版本号'}]}]"
          />
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">正常</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="设备类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['device_type', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">安卓</a-radio>
            <a-radio :value="2">苹果</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="平台" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['plat', {rules: [{required: true, min: 2, message: '请输入平台'}]}]"
          />
        </a-form-item>
        <a-form-item label="网页下载地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['downurl', {rules: [{required: true, min: 2, message: '请输入正确的网页下载地址'}]}]"
          />
        </a-form-item>
        <a-form-item label="APK下载地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['apk_downurl', {rules: [{required: true, min: 2, message: '请输入正确的APK下载地址'}]}]"
          />
        </a-form-item>
        <a-form-item label="下载方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['down_way', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">应用内</a-radio>
            <a-radio :value="2">应用外</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="更新方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['change_way', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">强制更新</a-radio>
            <a-radio :value="2">可选更新</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import * as Api from '@/api/setting/version'

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
      this.title = '新增App版本'
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
