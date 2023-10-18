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
        <a-form-item
            label="等级名称"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            extra="例如：超级会员、超级黄金会员、超级铂金会员、超级钻石会员"
        >
          <a-input v-decorator="['cname', {rules: [{required: true, message: '请输入等级名称'}]}]" />
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="数字越小越靠前">
          <a-input-number
              :min="0"
              v-decorator="['sort', {initialValue: 100, rules: [{required: true, message: '请输入排序值'}]}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import * as Api from '@/api/user/svip'
import { InputNumberGroup } from '@/components'

// 生成等级权重
const weights = []
for (let i = 1; i <= 20; i++) {
  weights.push(i)
}

export default {
  components: {
    InputNumberGroup
  },
  data () {
    return {
      currency_short: localStorage.getItem('currency_short'),
      // 对话框标题
      title: '编辑会员等级',
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
      // 等级权重
      weights,
      // 当前记录
      record: {}
    }
  },
  created () {

  },
  methods: {

    /**
     * 显示对话框
     */
    edit (record) {
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
      record.cascader = [
        record.province_id,
        record.city_id,
        record.region_id
      ]
      this.$nextTick(() => {
        setFieldsValue(pick(record, ['cname', 'sort',]))
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
      Api.edit({ id: this.record.id, form: values })
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
