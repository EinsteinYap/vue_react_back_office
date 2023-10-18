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
        <a-form-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['user_name', {rules: [{required: true, min: 1, message: '请输入用户名'}]}]"
          />
        </a-form-item>
        <a-form-item label="用户昵称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['nickname', {rules: [{required: true, min: 1, message: '请输入用户昵称'}]}]"
          />
        </a-form-item>
        <!--        <a-form-item label="支付密码" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
        <!--          <a-input-->
        <!--            v-decorator="['pwd', {rules: [{required: true, min: 1, message: '请输入支付密码'}]}]"-->
        <!--          />-->
        <!--        </a-form-item>-->
        <a-form-item label="区号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-if="areaCodeList" v-decorator="['area_code', { initialValue: areaCodeList.find(e => e.id == record.area_code )? areaCodeList.find(e => e.id == record.area_code ).cname : -1, rules: [{required: true, message: '请选择区号'}] }]">
            <a-select-option :value="item.id" v-for="item in areaCodeList" :key="item.id">
              {{ item.cname }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="区域" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['area', {rules: [{required: true, min: 1, message: '请输入区域'}]}]"
          />
        </a-form-item>
        <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['mobile', {rules: [{required: true, min: 1, message: '请输入手机号码'}]}]"
          />
        </a-form-item>
        <a-form-item label="标识" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['mark', {rules: [{required: true, min: 1, message: '请输入代理商标识'}]}]"
          />
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">冻结</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import * as Api from '@/api/agent/manager'
import * as GlobalApi from '@/api/globalization/code'

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
      form: this.$form.createForm(this),
      areaCodeList: [],
      // 当前记录
      record: {}
    }
  },
  created () {
    this.getAreaCodeList()
  },
  methods: {
    getAreaCodeList () {
      GlobalApi.all()
        .then(result => {
          this.areaCodeList = result.data.list.data
        })
        .finally(result => {
        })
    },
    /**
     * 显示对话框
     */
    edit (record) {
      // 显示窗口
      this.title = '编辑代理商'
      this.visible = true
      // 当前语言详情
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
          'user_name',
          'nickname',
          'pwd',
          'mobile',
          'mark',
          'area',
          'status'
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
      Api.edit({ form: values, id: this.record.id })
        .then((result) => {
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
