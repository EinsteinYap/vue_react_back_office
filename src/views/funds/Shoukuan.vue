<template>
  <a-modal
    class="noborder"
    :title="title"
    :width="520"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="用户ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['user_id', { rules: [{required: true}] }]" placeholder="请输入用户ID" />
        </a-form-item>
        <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['cateid', {  initialValue: 2, rules: [{required: true}]}]">
            <a-radio :value="1">USDT</a-radio>
            <a-radio :value="2">银行卡</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-if="form.getFieldValue('cateid') != 1" label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['user_name', { rules: [{required: true, message: '请输入姓名'}] }]" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item v-if="form.getFieldValue('cateid') != 1" label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['mobile', { rules: [{required: true, message: '请输入手机号码'}] }]" placeholder="请输入手机号码" />
        </a-form-item>
        <a-form-item v-if="form.getFieldValue('cateid') != 1" label="银行卡号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['bank_card_number', { rules: [{required: true, message: '请输入银行卡号'}] }]" placeholder="请输入银行卡号" />
        </a-form-item>
        <a-form-item v-if="form.getFieldValue('cateid') != 1" label="IFSC" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['ifsc', { rules: [{required: true ,message: '请输入IFSC'}] }]" placeholder="请输入IFSC" />
        </a-form-item>
        <a-form-item v-if="form.getFieldValue('cateid') == 1" label="钱包地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['address', { rules: [{required: true ,message: '请输入钱包地址'}] }]" placeholder="请输入钱包地址" />
        </a-form-item>
        <a-form-item v-if="form.getFieldValue('cateid') == 1" label="地址类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['address_cateid', { initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">TRC20</a-radio>
            <a-radio :value="2">ETH</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否默认" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['is_default', { initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="0">否</a-radio>
            <a-radio :value="1">是</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import * as Api from '@/api/store/user'
import { addpay } from '@/api/store/user'

export default {
  components: {
  },
  props: {
  },
  data () {
    return {
      // 对话框标题
      title: '新增用户收款',
      // 标签布局属性
      labelCol: { span: 7 },
      // 输入框布局属性
      wrapperCol: { span: 13 },
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

    // 显示对话框
    handle (record) {
      // 显示窗口
      this.visible = true
      // 当前记录
      this.record = record
      // 设置默认值
      this.setFieldsValue()
    },

    /**
     * 设置默认值
     */
    setFieldsValue () {
      const { record, form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(record, ['login_status']))
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
      console.log('values', values)
      values.user_id = Number(values.user_id)
      Api.addpay({ form: values })
        .then((result) => {
          // 显示成功
          this.$message.success(result.message, 1.5)
          // 关闭对话框事件
          this.handleCancel()
          // 通知父端组件提交完成了
          this.$emit('handleSubmit', values)
        })
        .finally(() => {
          this.confirmLoading = false
        })
    }

  }
}
</script>
<style lang="less">
.ant-form-item {
  margin-bottom: 15px;
}
</style>
