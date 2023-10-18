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
<!--    :defaultList="record.goods ? [record.goods] : []"-->
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="众筹活动标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['title', {rules: [{required: true, message: '请输入众筹活动标题'}]}]"
          />
        </a-form-item>
        <a-form-item label="众筹金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['amount', {rules: [{required: true, message: '请输入众筹金额'}]}]"
          />
        </a-form-item>

        <a-form-item label="最大投资次数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['limit_num', {rules: [{required: true, message: '请输入最大投资次数'}]}]"
          />
        </a-form-item>
<!--        <a-form-item label="模式" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--          <a-radio-group v-decorator="['model', {initialValue: 2, rules: [{required: true}]}]">-->
<!--            <a-radio :value="2">正常</a-radio>-->
<!--            <a-radio :value="1">模拟</a-radio>-->
<!--          </a-radio-group>-->
<!--        </a-form-item>-->
        <a-form-item label="模拟进度" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            :max="100"
            v-decorator="['fix_rate', {rules: [{required: true, message: '请输入模拟进度'}]}]"
          />
        </a-form-item>
        <a-form-item label="自增进度" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            :max="100"
            v-decorator="['self_increment', {rules: [{required: true, message: '请输入自增进度'}]}]"
          />
          <span style="margin-left: 5px;">% (每30分钟系统自动增加进度)</span>
        </a-form-item>
        <a-form-item label="进度最大值" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            :max="100"
            v-decorator="['max_rate', {rules: [{required: true, message: '请输入进度最大值'}]}]"
          />
          <span style="margin-left: 5px;">% (默认100%,设置为99%的情况下, 该项目无法成型)</span>
        </a-form-item>
        <a-form-item
          label="产品图片"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <SelectImage
            :multiple="false"
            :maxNum="10"
            :default-list="record.image ? [record.image] : []"
            v-decorator="['image_id', {rules: [{required: true, message: '请至少上传1张产品图片'}]}]"
          />
        </a-form-item>
<!--        <a-form-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--          <a-textarea v-decorator="['detail']" placeholder="请输入众筹描述" :autoSize="{ minRows: 4, maxRows: 6 }" />-->
<!--        </a-form-item>-->


        <a-form-item label="结算模式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['settle_model', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">先息后本</a-radio>
            <a-radio :value="2">还本反息</a-radio>
          </a-radio-group>
          <div>
            <span v-if="form.getFieldValue('settle_model') == 1">先息后本：按收益比例除以返还天数，到期一次还本。</span>
            <span v-else>还本反息：收益比例除以返还天数，到期还本。</span>
          </div>
        </a-form-item>

        <a-form-item label="返还天数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['total_day', {rules: [{required: true, message: '请输入返还天数'}]}]"
          />
        </a-form-item>

        <a-form-item label="收益比例" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            :max="100"
            v-decorator="['profit_rate', {rules: [{required: true, message: '请输入收益比例'}]}]"
          />
        </a-form-item>

        <a-form-item label="最小投资金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['min_buy_amount', {rules: [{required: true, message: '请输入最小投资金额'}]}]"
          />
        </a-form-item>

        <a-form-item label="最大投资金额" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            v-decorator="['max_buy_amount', {rules: [{required: true, message: '请输入最大投资金额'}]}]"
          />
        </a-form-item>

        <a-form-item label="语言选择" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['language_id', { initialValue: languageList.length > 0 ? languageList[0].id : -1 , rules: [{required: true, message: '请选择语言'}] }]">
            <a-select-option :value="item.id" v-for="item in languageList" :key="item.id">
              {{ item.cname }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="是否有推荐奖励" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['is_spread', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否有分红奖励" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['is_bonus', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="描述" :labelCol="labelCol" :wrapperCol="{span: 16}">

          <Ueditor v-decorator="['detail', {rules: [{required: true, message: '描述详情不能为空'}]}]" />
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import * as Api from '@/api/sales/crowd'
import { SelectGoods, SelectImage, Ueditor } from '@/components'
import moment from 'moment/moment'
import * as LanguageApi from '@/api/globalization/language'
import pick from 'lodash.pick'

export default {
  components: { Ueditor, SelectImage, SelectGoods },
  props: {
  },
  data () {
    return {
      languageList: [],
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
  created () {
    this.getLanguageList()
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
      this.title = '编辑众筹活动'
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
        console.log(this.record)

        const data = _.pick(this.record, [
          'title',
          'amount',
          'profit_rate',
          'limit_num',
          'fix_rate',
          'self_increment',
          'image_id',
          'detail',
          'settle_model',
          'total_day',
          'min_buy_amount',
          'max_buy_amount',
          'language_id',
          'is_spread',
          'is_bonus',
          'status',
          'max_rate',
          'total_day'
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
      const postData = { ...values }
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
