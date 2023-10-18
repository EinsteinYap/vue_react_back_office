<template>
  <a-modal
      :title="title"
      :width="920"
      :visible="visible"
      :confirmLoading="confirmLoading"
      :maskClosable="false"
      :destroyOnClose="true"
      @ok="handleSubmit"
      @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="用户ID"  :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
              :disabled="true"
              v-decorator="['user_id', { initialValue: record.user_id ,rules: [{required: true, message: '请输入用户ID'}]}]"
          />
        </a-form-item>

        <a-form-item label="产品" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <SelectGoods
              :multiple="false"
              v-decorator="['goods_id', { rules: [{ required: true, message: '请选择指定的产品' }] }]"
          />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import * as Api from '@/api/sales/incentive'
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
      form: this.$form.createForm(this),
      record: {}
    }
  },
  methods: {

    /**
     * 显示对话框
     */
    add (item) {
      this.title = '赠送商品'
      this.visible = true
      this.record = item
    },

    /**
     * 确认按钮
     */
    handleSubmit (e) {
      e.preventDefault()
      const { form: { validateFields } } = this

      // 表单验证
      validateFields((errors, values) => {
        console.log('values', values)
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
      values.user_id = Number(values.user_id)
      Api.giftGoods(values)
          .then((result) => {
            // 显示成功
            this.$message.success(result.message, 1.5)
            // 关闭对话框
            this.handleCancel()
            // 通知父端组件提交完成了
            this.$emit('handleSubmit', values)
            this.form.resetFields()
          })
          .finally((result) => {
            this.confirmLoading = false
          })
    }

  }
}
</script>
