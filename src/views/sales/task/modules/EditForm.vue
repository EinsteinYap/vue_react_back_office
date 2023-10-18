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
        <a-form-item label="任务标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['title', {rules: [{required: true, min: 0, message: '请输入任务标题'}]}]"
          />
        </a-form-item>
<!--        <a-form-item label="任务描述" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--          <a-textarea :autoSize="{ minRows: 4, maxRows: 6 }" v-decorator="['remark',{rules: [{required: true, min: 0, message: '请输入任务描述'}]}]" />-->
<!--        </a-form-item>-->
        <a-form-item label="到期时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker format="YYYY-MM-DD" v-decorator="['end_time']" />
        </a-form-item>
        <a-form-item label="按钮名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['btn_name', {rules: [{required: true, min: 0, message: '请输入按钮名称'}]}]"
          />
        </a-form-item>
        <a-form-item label="奖励金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            v-decorator="['award_money', {rules: [{required: true,message: '请输入奖励金额'}]}]"
          />
        </a-form-item>
        <a-form-item label="语言选择" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['language_id', {rules: [{required: true,message: '请输入选择语言'}]}] ">
            <a-select-option :value="item.id" v-for="item in languageList" :key="item.id">
              {{ item.cname }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['cateid', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">充值</a-radio>
            <a-radio :value="2">分享</a-radio>
            <a-radio :value="3">购买</a-radio>
            <a-radio :value="4">上传</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="0">未开启</a-radio>
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="2">关闭</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="图片素材" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <div style="display: none">{{record.pics}}</div>
          <SelectImage
            :multiple="false"
            :defaultList="record ? record.pics : []"
            v-decorator="['pics', { rules: [{ required: true, message: '请选择至少一张图片' }] }]"
          />
        </a-form-item>
<!--        <a-form-item-->
<!--          label="视频素材"-->
<!--          :labelCol="labelCol"-->
<!--          :wrapperCol="wrapperCol"-->
<!--        >-->
<!--          <SelectVideo :multiple="true" :defaultList="record.videos" v-decorator="['videos', { rules: [{ required: true, message: '请选择至少一个视频' }] }]" />-->
<!--        </a-form-item>-->
        <a-form-item label="任务简介" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea :autoSize="{ minRows: 4, maxRows: 6 }" v-decorator="['synopsis', {rules: [{required: true, message: '任务简介不能为空'}]}]"  />
        </a-form-item>
        <a-form-item label="任务描述" :labelCol="labelCol" :wrapperCol="{span: 16}">
          <Ueditor v-decorator="['remark', {rules: [{required: true, message: '任务描述不能为空'}]}]" />
<!--          <Ueditor v-decorator="['detail', {rules: [{required: true, message: '描述详情不能为空'}]}]" />-->
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import * as Api from '@/api/sales/task'
import { SelectGoods, SelectImage, SelectVideo, Ueditor } from '@/components'
import moment from 'moment/moment'
import * as LanguageApi from '@/api/globalization/language'
export default {
  components: { Ueditor, SelectGoods, SelectImage, SelectVideo },
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
      languageList: []
    }
  },
  created () {
    this.getLanguageList()
  },

  methods: {
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
      this.title = '编辑任务'
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
          'title',
          'end_time',
          'btn_name',
          'award_money',
          'cateid',
          'status',
          'pics',
          'videos',
          'language_id',
          'remark',
          'synopsis'
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
      const postData = { ...values }


      postData.pics = values.pics.map(item => {
        return item.file_id || item
      })

      // postData.videos = values.videos.map(item => {
      //   return item.file_id
      // })

      console.log('postData.pics', postData.pics)

      postData.end_time = moment(postData.end_time).format('YYYY-MM-DD')
      Api.edit({ form: postData, id: this.record.id })
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
