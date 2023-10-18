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
        <a-form-item label="客服名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['cname', {rules: [{required: true, min: 0, message: '请输入客服名称'}]}]"
          />
        </a-form-item>
<!--        <a-form-item label="所属代理" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--          <a-select-->
<!--            :defaultValue="record.agent_id"-->
<!--            v-decorator="['agent_id', {rules: [{ required: true, message: '请选择所属代理ID(限数字)'}]}]"-->
<!--          >-->
<!--            <a-select-option-->
<!--              v-for="item in agentList"-->
<!--              :key="item.id"-->
<!--              :value="item.id"-->
<!--            >{{ item.user_name }}</a-select-option>-->
<!--          </a-select>-->
<!--        </a-form-item>-->
        <a-form-item label="链接" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['link', {rules: [{required: true, min: 0, message: '请输入链接地址'}]}]"
          />
        </a-form-item>
        <a-form-item label="渠道" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['channel', {rules: [{required: true, min: 0, message: '请输入渠道'}]}]"
          />
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">正常</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import * as Api from '@/api/setting/customer'
import { SelectImage } from '@/components'
import moment from 'moment/moment'
import * as AgentApi from '@/api/agent/manager'

export default {
  components: { SelectImage },
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
      record: {},
      agentList: [],
    }
  },
  async created () {
    await this.getAganetList()
  },
  methods: {
    getAganetList () {
      AgentApi.getAllList()
        .then(result => {
          result.data.unshift({
            id: 0,
            user_name: '平台',
            nickname: '平台'
          })
          this.agentList = result.data
        })
    },
    /**
     * 显示对话框
     */
    edit (record) {
      // 显示窗口
      this.title = '编辑客服'
      this.visible = true
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
          'cname',
          'agent_id',
          'link',
          'channel',
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
