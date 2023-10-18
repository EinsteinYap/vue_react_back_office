<template>
  <a-modal
    class="noborder"
    :title="title"
    :width="420"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-row v-for="(item, index) in colData" :key="index">
        <a-col :span="8">{{ item.label }}</a-col>
        <a-col :span="16" style="color: red;">{{ record[item.key] }}</a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import * as Api from '@/api/agent/manager'

const colData = [
  {
    label: '代理ID',
    key: 'id'
  },
  {
    label: '上级ID',
    key: 'parent_id'
  },
  {
    label: '用户名',
    key: 'user_name'
  },
  {
    label: '用户昵称',
    key: 'nickname'
  },
  {
    label: '区域',
    key: 'area'
  },
  {
    label: '区号',
    key: 'area_code'
  },
  {
    label: '手机号码',
    key: 'mobile'
  },
  {
    label: '标识',
    key: 'mark'
  },
  {
    label: '资金余额',
    key: 'balance'
  },
  {
    label: '红包余额',
    key: 'red_paper'
  },

  {
    label: '最后登录时间',
    key: 'last_login_time'
  },
  {
    label: '类型',
    key: 'cate_label'
  },
  {
    label: '状态',
    key: 'status_label'
  },
  {
    title: '用户总数'
  },
  {
    title: '用户充值金额'
  },
  {
    title: '用户购物统计'
  },
  {
    title: '用户提现金额'
  },
  {
    title: '用户总余额'
  },
  {
    label: '更新时间',
    key: 'update_time'
  }
]

export default {
  components: {
  },
  props: {
  },
  data () {
    return {
      colData,
      // 对话框标题
      title: '代理商详情',
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
        setFieldsValue(pick(record, ['parent_id']))
      })
    },

    /**
     * 确认按钮
     */
    handleSubmit (e) {
      this.visible = false
    },

    /**
     * 关闭对话框事件
     */
    handleCancel () {
      this.visible = false
      // this.form.resetFields()
    },

    /**
     * 提交到后端api
     */
    onFormSubmit (values) {
      this.confirmLoading = true
      Api.setNewPwd({ id: this.record.id, form: values })
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
