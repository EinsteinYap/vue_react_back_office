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
        <a-form-item label="密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['pwd', {rules: [{required: true, min: 1, message: '请输入密码'}]}]"
          />
        </a-form-item>
        <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['cate_id', { initialValue: 1 }]">
            <a-select-option :value="1">经理</a-select-option>
            <a-select-option :value="2">员工</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['mobile', {rules: [{required: true, min: 1, message: '请输入手机号码'}]}]"
          />
        </a-form-item>
        <a-form-item label="所属代理" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['agent_id', {rules: [{required: true, message: '请选择所属代理ID'}]}]"
            @change="selectChildList"
          >
            <a-select-option
              v-for="item in agentList"
              :key="item.id"
              :value="item.id"
            >{{ `${item.user_name} - ${item.nickname}`  }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="this.form.getFieldValue('cate_id') == 2" label="所属经理" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['parent_id', {rules: [{required: true, message: '请选择所属经理'}]}]"
          >
            <a-select-option
              v-for="item in staffList"
              :key="item.id"
              :value="item.id"
            >{{ `${item.user_name} - ${item.nickname}`  }}</a-select-option>
          </a-select>

        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>

import * as Api from '@/api/agent/staff'
import * as AgentApi from '@/api/agent/manager'

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
      // 区号
      areaCodeList: [],
      agentList: [],
      staffList: []
    }
  },
  async created () {
    await this.getAganetList()
  },
  methods: {
    selectChildList (item) {
      AgentApi.getStaffList({ agent_id: item, cate_id: 1 })
        .then(result => {
          this.staffList = result.data
          if (this.staffList.length === 0) {
            this.form.resetFields('parent_id')
          }
        })
    },

    getAganetList () {
      AgentApi.getAllList({ cateid: 1 })
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
    add () {
      this.title = '新增员工'
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
