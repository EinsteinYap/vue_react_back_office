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

        <!--        [ { "goods_id": 1, "goods_name": "商品名称", "back_money": "100.00", "goods_price": "100.00" } ]-->
        <!--          :defaultList="record.goods ? [record.goods] : []"-->
        <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['cateid', {rules: [{required: true}]}]">
            <a-radio :value="1">所有人</a-radio>
            <a-radio :value="2">等级用户</a-radio>
            <a-radio :value="3">单个用户</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-if="form.getFieldValue('cateid') == 2" label="用户等级" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['cate_value', {initialValue: record.cate_value, rules: [{required: true}]}]">
            <a-select-option :value="item.grade_id" v-for="item in gradeList" :key="item.grade_id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="form.getFieldValue('cateid') == 3" label="用户ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['cate_value', {initialValue: record.cate_value, rules: [{required: true, message: '请输入用户ID'}]}]"
          />
        </a-form-item>

        <a-form-item label="是否弹窗" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['is_pop', {initialValue: record.is_pop,rules: [{required: true}]}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['is_image', {initialValue: record.image, rules: [{required: true}]}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          v-if="record.is_image"
          label="图片选择"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <SelectImage :default-list="record.image ? [record.image] : []" :multiple="false" v-decorator="['image_id']" />
        </a-form-item>

        <a-form-item label="选择产品" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="如果不需要产品,则不选">
          <SelectGoods
            v-if="visible && eGoodsList.length > 0"
            :multiple="false"
            :default-list="eGoodsList"
            v-decorator="['goods_id', { rules: [{required: false, message: '请选择指定的产品' }] }]"
          />
        </a-form-item>
        <a-form-item v-show="!form.getFieldValue('is_image')" label="公告内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea :autoSize="{ minRows: 4, maxRows: 6 }" v-decorator="['content',{rules: [{required: true, min: 0, message: '请输入公告内容'}]}]" />
        </a-form-item>

        <a-form-item label="语言" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['language_id', {rules: [{required: true}]}]">
            <a-select-option :value="item.id" v-for="item in languageList" :key="item.id">
              {{ item.cname }}
            </a-select-option>
          </a-select>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import * as Api from '@/api/setting/notice'
import * as GlobalApi from '@/api/globalization/language'
import { SelectGoods, SelectImage } from '@/components'
import * as GradeApi from '@/api/user/grade'

export default {
  components: { SelectImage, SelectGoods },
  props: {
  },
  data () {
    return {
      eGoodsList: [],
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
      areaCodeList: [],
      languageList: [],
      // 当前记录
      record: {}
    }
  },
  created () {
    this.getLanguageList()
    this.getGradeList()
  },
  methods: {
    getLanguageList () {
      GlobalApi.all().then(response => {
        this.languageList = response.data.list.data
      })
    },

    // 获取会员等级列表
    getGradeList () {
      GradeApi.all().then(result => {
        this.gradeList = result.data.list
      })
    },
    /**
     * 显示对话框
     */
    edit (record) {
      // 显示窗口
      this.title = '编辑公告'
      this.visible = true
      // 当前语言详情
      this.record = record
      console.log('record', record)
      // 设置默认值
      this.setFieldsValue()
    },

    /**
     * 设置默认值
     */
    setFieldsValue () {
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        console.log('this.record', this.record)
        const data = _.pick(this.record, [
          'content',
          'cateid',
          'cate_value',
          'language_id',
          'is_pop',
          'is_image',
          'image_id',
        ])
        // this.form.setFieldsValue('cate_level_value') = this.record.cate_value
        this.eGoodsList = [this.record.goods]
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
      if (values.cateid == 1) {
        values.cate_value = 0
      }
      if (!values.goods_id) {
        values.goods_id = 0
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
