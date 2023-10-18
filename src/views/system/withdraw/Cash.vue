<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="入款额倍数" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="0为不限制,如果设置了倍数,则提现金额必须大于这个的倍数">
          <a-input-number
            :min="0"
            v-decorator="['income_times', {initialValue: 0, rules: [{required: true, message: '请输入入款额倍数'}]}]"
          />
        </a-form-item>
        <a-form-item label="消费金额" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="0为不限制,如果设置了消费金额,则必须有消费达到设定金额后方可提现">
          <a-input-number
            :min="0"
            v-decorator="['consume', {initialValue: 0, rules: [{required: true, message: '请输入消费金额'}]}]"
          />
        </a-form-item>
        <a-form-item label="当日提现时间范围" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="单位: 小时">
          <a-input-number :min="1" :max="24" v-decorator="['today.hour[0]', {initialValue: 1, rules: [{required: true, message: '请输入开始时间'}]}]" placeholder="请输入开始时间" />
          <span> - </span>
          <a-input-number :min="1" :max="24" v-decorator="['today.hour[1]', {initialValue: 24, rules: [{required: true, message: '请输入结束时间'}]}]" placeholder="请输入结束时间" />
        </a-form-item>
        <a-form-item label="当天可提现金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['today.money', {initialValue: 0, rules: [{required: true, message: '请输入当天可提现金额'}]}]"
          />
        </a-form-item>
        <a-form-item label="当天可提现次数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['today.times', {initialValue: 0, rules: [{required: true, message: '请输入当天可提现次数'}]}]"
          />
        </a-form-item>
        <a-form-item label="可提现日期" :labelCol="labelCol" :wrapperCol="{ span: 11 }">
          <a-checkbox-group
            v-decorator="['week', { initialValue: [1,2,3,4,5,6,7], rules: [{required: true, message: '请输入当天可提现次数'}] }]"
            style="width: 100%;"
          >
            <a-checkbox :value="1">
              周一
            </a-checkbox>
            <a-checkbox :value="2">
              周二
            </a-checkbox>
            <a-checkbox :value="3">
              周三
            </a-checkbox>
            <a-checkbox :value="4">
              周四
            </a-checkbox>
            <a-checkbox :value="5">
              周五
            </a-checkbox>
            <a-checkbox :value="6">
              周六
            </a-checkbox>
            <a-checkbox :value="0">
              周日
            </a-checkbox>
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="提现手续费" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['fee', {initialValue: 0, rules: [{required: true, message: '请输入提现手续费'}]}]"
          />
        </a-form-item>
        <a-form-item label="最高提现金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['money_max', {initialValue: 0, rules: [{required: true, message: '请输入最高提现金额'}]}]"
          />
        </a-form-item>
        <a-form-item label="最低提现金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['money_min', {initialValue: 0, rules: [{required: true, message: '请输入最低提现金额'}]}]"
          />
        </a-form-item>
        <a-form-item label="是否开启短信验证" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['sms_status', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="用户白名单ID" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="多个ID请用,号隔开,请不要传入非法格式">
<!--          {{record.white_list}}-->
<!--          initialValue: record.white_list-->
          <a-input
            v-decorator="['white_list', { rules: [{required: false, message: '请输入用户白名单ID'}]}]"
            placeholder="请输入用户白名单ID"
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
      key: 'money_withdraw',
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
      console.log('record.white_list', record.white_list)
      record.white_list = record.white_list ? record.white_list.join(',') : ""
      !isEmpty(form.getFieldsValue()) && $nextTick(() => {

        form.setFieldsValue(pick(record, [
          'income_times',
          'consume',
          'today',
          'money',
          'times',
          'week',
          'money_max',
          'money_min',
          'sms_status',
          'fee',
          'sms_status',
          'white_list'
        ]))
        // 'white_list'

        // console.log('form.setFieldsValue', form.getFieldValue('white_list'))
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
      // console.log(values.white_list)
      // values.white_list = values.white_list.split(',')
      let new_white_list = [];
      if (values.white_list.length > 0) {
        new_white_list = values.white_list.split(',')
      }
      console.log(new_white_list)
    // , white_list: new_white_list
      Api.update(this.key, { form: { ...values, white_list: new_white_list } })
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
