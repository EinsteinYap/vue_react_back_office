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
        <a-form-item label="支付名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['pay_name', { rules: [{required: true, min: 1, message: '请输入支付名称'}]}]"
          />
        </a-form-item>
        <a-form-item label="支付代号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['pay_code', { rules: [{required: true, min: 1, message: '请输入支付代号'}]}]"
          />
        </a-form-item>

        <a-form-item label="最小充值" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['min_recharge', { rules: [{required: true, message: '请输入最小充值'}]}]"
          />
        </a-form-item>
        <a-form-item label="最大充值" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['max_recharge', { rules: [{required: true, message: '请输入最大充值'}]}]"
          />
        </a-form-item>
        <a-form-item label="充值手续费" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['recharge_fee', { initialValue: record.recharge_fee ? record.recharge_fee : 0 , rules: [{required: true, message: '请输入充值手续费'}]}]"
          />
        </a-form-item>
        <a-form-item label="固定充值手续费" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
              :min="0"
              v-decorator="['recharge_fixed_fee', { initialValue: record.recharge_fixed_fee ? record.recharge_fee : 0 , rules: [{required: true, message: '请输入固定充值手续费'}]}]"
          />
        </a-form-item>
        <a-form-item label="充值汇率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['recharge_exchange_id', { initialValue: record.recharge_exchange_id ? record.recharge_exchange_id : optionList.exchange[0].id, rules: [{required: true, message: '请选择充值汇率'}] }]">
            <a-select-option :value="item.id" v-for="item in optionList.exchange" :key="item.id">
              {{ `${item.country} - ${item.rate}` }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="充值状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['recharge_status', { initialValue: record.recharge_status ? record.recharge_status : 0, rules: [{required: true}]}]">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="最小提现" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['min_withdraw', { initialValue: record.min_withdraw ? record.min_withdraw : 0 , rules: [{required: true, message: '请输入最小提现'}]}]"
          />
        </a-form-item>
        <a-form-item label="提现手续费" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['withdraw_fee', { initialValue: record.withdraw_fee ? record.withdraw_fee : 0 , rules: [{required: true, message: '请输入提现手续费'}]}]"
          />
        </a-form-item>
        <a-form-item label="固定提现手续费" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
              :min="0"
              v-decorator="['withdraw_fixed_fee', { initialValue: record.withdraw_fixed_fee ? record.withdraw_fee : 0 , rules: [{required: true, message: '请输入固定提现手续费'}]}]"
          />
        </a-form-item>
        <a-form-item label="提现汇率" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['withdraw_exchange_id', { initialValue: record.withdraw_exchange_id ? record.withdraw_exchange_id : optionList.exchange[0].id , rules: [{required: true, message: '请选择提现汇率'}] }]">
            <a-select-option :value="item.id" v-for="item in optionList.exchange" :key="item.id">
              {{ `${item.country} - ${item.rate}` }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="提现状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['withdraw_status', { initialValue: record.withdraw_status ? record.withdraw_status : 1 , rules: [{required: true, message: '请选择提现状态' }]}]">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea :autoSize="{ minRows: 4, maxRows: 6 }" v-decorator="['pay_desc',{ initialValue: record.pay_desc ? record.pay_desc : '', rules: [{required: true, min: 0, message: '请输入任务描述'}]}]" />
        </a-form-item>

        <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['category_id', { initialValue: record.category_id ? record.category_id : optionList.category[0].id, rules: [{required: true, message: '请选择类型'}] }]">
            <a-select-option :value="item.id" v-for="item in optionList.category" :key="item.id">
              {{ `${item.cname}` }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="币种" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['currency_id', { initialValue: record.currency_id ? record.currency_id : optionList.currency[0].id, rules: [{required: true, message: '请选择币种'}] }]">
            <a-select-option :value="item.id" v-for="item in optionList.currency" :key="item.id">
              {{ `${item.cname}` }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', { initialValue: record.status ? record.status : 0, rules: [{required: true}]}]">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          v-for="(k, index) in pay_config"
          :key="k"
          :label="k.name"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <!--          <div>{{ pay_config[index].name }}</div>-->
          <a-input
            v-model="pay_config[index].value"
            placeholder="请填写值"
          />
<!--          <a-input-->
<!--            v-model="pay_config[index].text"-->
<!--            placeholder="请填写名称"-->
<!--            style="width: 20%; margin-right: 8px"-->
<!--          />-->
<!--          <a-input-->
<!--            v-model="pay_config[index].value"-->
<!--            placeholder="请填写值"-->
<!--            style="width: 20%; margin-right: 8px"-->
<!--          />-->

        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="数字越小越靠前">
          <a-input-number
            :min="0"
            v-decorator="['sort', { initialValue: record.sort ? record.sort : 0, initialValue: 100, rules: [{required: true, message: '请输入至少1个数字'}]}]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import * as Api from '@/api/payment/mode'
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
      optionList: {},
      // 当前记录
      record: {},
      pay_config: []
    }
  },
  async created () {
    await this.getOptionList()
  },
  methods: {
    getOptionList () {
      Api.option().then(response => {
        console.log('response', response)
        this.optionList = response.data
      })
      // GlobalApi.all().then(response => {
      //   this.languageList = response.data.list.data
      // })
    },
    /**
     * 显示对话框
     */
    edit (record) {
      // 显示窗口
      this.title = record.id ? '编辑支付方式' : '安装支付方式'
      this.visible = true

      // 当前语言详情
      this.record = record
      this.pay_config = record.pay_config

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
          'pay_name',
          'pay_code',
          'min_recharge',
          'max_recharge',
          'recharge_fee',
          'recharge_exchange_id',
          'recharge_status',
          'min_withdraw',
          'withdraw_fee',
          'withdraw_exchange_id',
          'withdraw_status',
          'pay_desc',
          'category_id',
          'currency_id',
          'status',
          'recharge_fixed_fee',
          'withdraw_fixed_fee',
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
      values.pay_config = this.pay_config
      // add
      if (!this.record.id) {
        Api.add({ form: values })
          .then((result) => {
            // 显示成功
            this.$message.success(result.message, 1.5)
            // 关闭对话框
            this.handleCancel()
            this.record = {}
            this.pay_config = []
            // 通知父端组件提交完成了
            this.$emit('handleSubmit', values)
          })
          .finally((result) => {
            this.confirmLoading = false
          })
      } else {
        Api.edit({ form: values, id: this.record.id })
          .then((result) => {
            // 显示成功
            this.$message.success(result.message, 1.5)
            // 关闭对话框事件
            this.handleCancel()
            this.record = {}
            this.pay_config = []
            // 通知父端组件提交完成了
            this.$emit('handleSubmit', values)
          })
          .finally((result) => {
            this.confirmLoading = false
          })
      }
    }

  }
}
</script>
