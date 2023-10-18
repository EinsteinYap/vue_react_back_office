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
        <a-form-item label="广告名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['cname', {rules: [{required: true, min: 0, message: '请输入广告名称'}]}]"
          />
        </a-form-item>
        <a-form-item label="广告类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['typeid', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">图片</a-radio>
            <a-radio :value="2">视频</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-if="form.getFieldValue('typeid') == 1 || !form.getFieldValue('typeid')" label="广告图" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <SelectImage
            v-decorator="['image_id', {rules: [{required: true, message: '请选择1个广告图'}]}]"
          />
        </a-form-item>
        <a-form-item
          v-if="form.getFieldValue('typeid') == 2"
          label="主图视频"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <SelectVideo :multiple="false" v-decorator="['video_id',  {rules: [{required: true, message: '请选择1个广告视频'}]}]" />
        </a-form-item>
        <a-form-item label="跳转类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['jump_cate', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="0">内部</a-radio>
            <a-radio :value="1">外部</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="跳转地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['link', {rules: [{required: true, min: 0, message: '请输入跳转地址'}]}]"
          />
        </a-form-item>
        <a-form-item label="变动时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-range-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['betweenTime']" />
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="数字越小越靠前">
          <a-input-number
            :min="0"
            v-decorator="['sort', {initialValue: 100, rules: [{required: true, message: '请输入至少1个数字'}]}]"
          />
        </a-form-item>
        <a-form-item label="语言选择" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['language_id', { initialValue: languageList.length > 0 ? languageList[0].id : 0 }]">
            <a-select-option :value="item.id" v-for="item in languageList" :key="item.id">
              {{ item.cname }}
            </a-select-option>
          </a-select>
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

import * as Api from '@/api/setting/admenu'
import { SelectImage,SelectVideo } from '@/components'
import moment from 'moment/moment'
import * as LanguageApi from '@/api/globalization/language'

export default {
  components: { SelectImage, SelectVideo },
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
      languageList: [],
    }
  },
  async created () {
    await this.getLanguageList()
  },
  methods: {

    /**
     * 显示对话框
     */
    add () {
      this.title = '新增轮播广告'
      this.visible = true
    },

    // 获取语言列表
    getLanguageList () {
      LanguageApi.all().then(response => {
        this.languageList = response.data.list.data
      })
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
      // data.betweenTime = [moment(data.betweenTime[0]), moment(data.betweenTime[1])]
      //   .format('YYYY-MM-DD')
      const newValues = {
        ...values,
        start_time: moment(values.betweenTime[0]),
        end_time: moment(values.betweenTime[1]),
        cateid: 1
      }
      console.log('newValues', newValues)
      Api.add({ form: newValues })
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
