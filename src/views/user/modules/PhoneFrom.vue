<template>
  <a-modal
    class="noborder"
    :title="title"
    :width="520"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="会员ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span>{{ record.user_id }}</span>
        </a-form-item>
        <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['mobile', { initialValue: record.mobile, rules: [{required: true, message: '请输入正确的密码'}]}]"
          />
        </a-form-item>
        <a-form-item label="区号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            placeholder="请选择区号"
            v-decorator="['area_code', { initialValue: record.area_code, rules: [{ required: true }] }]"
          >
            <a-select-option
              v-for="(item, index) in gradeList"
              :key="index"
              :value="item.code"
            >{{ item.cname }} +{{ item.code }}</a-select-option>
          </a-select>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import * as Api from '@/api/user'

export default {
  components: {
  },
  props: {
    // 会员等级列表
    gradeList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      // 对话框标题
      title: '修改会员手机',
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
        setFieldsValue(pick(record, ['grade_id']))
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
      Api.phoneedit({ userId: this.record.user_id, form: values })
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
