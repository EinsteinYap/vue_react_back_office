<template>
  <a-modal
    :title="title"
    :width="920"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="规则名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['cname', {rules: [{required: true, message: '请输入规则名称'}]}]"
          />
        </a-form-item>
        <a-form-item label="邀请人数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['invite_num', {rules: [{required: true, message: '请输入邀请人数'}]}]"
          />
        </a-form-item>
        <a-form-item label="最低消费金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['min_consume', {rules: [{required: true, message: '请输入最低消费金额'}]}]"
          />
        </a-form-item>


        <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['cateid', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">现金</a-radio>
            <a-radio :value="2">产品</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-if="form.getFieldValue('cateid') == 2" label="产品" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <SelectGoods
            :multiple="false"
            :defaultList="record.award_data ? [record.award_data] : []"
            v-decorator="['award_data', { rules: [{ required: true, message: '请选择指定的产品' }] }]"
          />
        </a-form-item>
        <a-form-item v-if="form.getFieldValue('cateid') == 1" label="奖励金" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['award_value', { initialValue: Number(record.award_value), rules: [{required: true, message: '请输入奖值'}]}]"
          />
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="数字越小越靠前">
          <a-input-number
            :min="0"
            v-decorator="['sort', {initialValue: 100, rules: [{required: true, message: '请输入至少1个数字'}]}]"
          />
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="0">关闭</a-radio>
            <a-radio :value="1">正常</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import _ from 'lodash'
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

      // 当前记录
      record: {}
    }
  },
  methods: {
    /**
     * 显示对话框
     */
    edit (record) {
      // 显示窗口
      this.title = '编辑邀请规则'
      this.visible = true
      // 当前语言详情
      // console.log('record', record)
      // record.betweenTime = [moment(record.start_time), moment(record.end_time)]
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
        const data = _.pick(this.record, [
          'cname',
          'goods_id',
          'invite_num',
          'min_consume',
          'award_value',
          'award_data',
          'status',
          'cateid',
          'sort'
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

      if (values.award_data) {
        values.award_value = values.award_data
      }

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
