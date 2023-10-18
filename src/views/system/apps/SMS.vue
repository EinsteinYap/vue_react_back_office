<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="短信签名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['sign', {rules: [{required: true, message: '请输入短信签名'}]}]" placeholder="请输入短信签名" />
        </a-form-item>
        <a-form-item label="短信KEY" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['key', {rules: [{required: true, message: '请输入短信KEY'}]}]" placeholder="请输入短信KEY" />
        </a-form-item>
        <a-form-item label="短信秘钥" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['secret', {rules: [{required: true, message: '请输入短信秘钥'}]}]" placeholder="请输入短信秘钥" />
        </a-form-item>
        <a-form-item label="短信APPID" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['app_id', {rules: [{required: true, message: '请输入短信APPID'}]}]" placeholder="请输入短信APPID" />
        </a-form-item>
        <a-form-item label="短信有效分钟" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="单位：分">
          <a-input-number
            :min="1"
            v-decorator="['minute', {initialValue: 1, rules: [{required: true, message: '请输入至少1'}]}]"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: wrapperCol.span, offset: labelCol.span }">
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
import { pick, omit } from 'lodash'
import { isEmpty } from '@/utils/util'
import * as Api from '@/api/setting/store'

export default {
  data () {
    return {
      // 当前设置项的key
      key: 'sms_set',
      // 标签布局属性
      labelCol: { span: 3 },
      // 输入框布局属性
      wrapperCol: { span: 10 },
      // loading状态
      isLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this),
      // 当前记录详情
      record: {}
    }
  },
  // 初始化数据
  created () {
    // 获取当前详情记录
    this.getDetail()
  },
  methods: {

    // 获取当前详情记录
    getDetail () {
      this.isLoading = true
      Api.detail(this.key)
        .then(result => {
          // 当前记录
          this.record = result.data.values
          // 设置默认值
          this.setFieldsValue()
        })
        .finally(result => {
          this.isLoading = false
        })
    },

    /**
     * 设置默认值
     */
    setFieldsValue () {
      const app = this
      const { record, $nextTick, form } = app
      !isEmpty(form.getFieldsValue()) && $nextTick(() => {
        form.setFieldsValue(pick(record, ['status', 'sign', 'key', 'minute', 'secret', 'app_id']))
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
     * 提交到后端api
     */
    onFormSubmit (values) {
      this.isLoading = true
      Api.update(this.key, { form: values })
        .then((result) => {
          // 显示提示信息
          this.$message.success(result.message, 1.5)
        })
        .finally((result) => {
          this.isLoading = false
        })
    }

  }
}
</script>
<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 10px;
}
/deep/.ant-form-item-control {
  padding-left: 10px;

  .ant-form-item-control {
    padding-left: 0;
  }
}
.ant-divider {
  margin-top: 50px !important;
}
</style>
