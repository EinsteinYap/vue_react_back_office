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
        <a-form-item label="菜单名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['cname', {rules: [{required: true, min: 0, message: '请输入菜单名称'}]}]"
          />
        </a-form-item>
        <a-form-item label="菜单图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <SelectImage
            :default-list="record.image?[record.image] : []"
            v-decorator="['image_id', {rules: [{required: true, message: '请选择1个菜单图片'}]}]"
          />
        </a-form-item>
        <a-form-item label="跳转类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['jump_cate', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">内部</a-radio>
            <a-radio :value="0">外部</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="跳转地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['link', {rules: [{required: true, min: 0, message: '请输入跳转地址'}]}]"
          />
        </a-form-item>
<!--        <a-form-item label="变动时间" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--          <a-range-picker-->
<!--            format="YYYY-MM-DD"-->
<!--            v-decorator="['betweenTime']" />-->
<!--        </a-form-item>-->
        <a-form-item label="语言选择" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['language_id']">
            <a-select-option :value="item.id" v-for="item in languageList" :key="item.id">
              {{ item.cname }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="数字越小越靠前">
          <a-input-number
            :min="0"
            v-decorator="['sort', {initialValue: 100, rules: [{required: true, message: '请输入至少1个数字'}]}]"
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
import * as Api from '@/api/setting/admenu'
import { SelectImage } from '@/components'
import moment from 'moment/moment'
import * as LanguageApi from '@/api/globalization/language'

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
      languageList: [],
    }
  },
  async created () {
    await this.getLanguageList()
  },
  methods: {
    // 获取语言列表
    getLanguageList () {
      LanguageApi.all().then(response => {
        this.languageList = response.data.list.data
      })
    },
    /**
     * 显示对话框
     */
    edit (record) {
      // 显示窗口
      this.title = '编辑菜单'
      this.visible = true
      // 当前语言详情
      console.log('record', record)
      record.betweenTime = [moment(record.start_time), moment(record.end_time)]
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
          'image_id',
          'link',
          'betweenTime',
          'status',
          'language_id'
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
      Api.edit({ form: { ...values, cateid: 2, typeid: 1 }, id: this.record.id })
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
