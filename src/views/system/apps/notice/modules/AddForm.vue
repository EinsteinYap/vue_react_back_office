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
        <!--          :defaultList="record.goods ? [record.goods] : []"-->
        <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['cateid', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">所有人</a-radio>
            <a-radio :value="2">等级用户</a-radio>
            <a-radio :value="3">单个用户</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item v-if="form.getFieldValue('cateid') == 2" label="用户等级" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['cate_value', {initialValue: gradeList.length > 0 ? gradeList[0].grade_id : 0, rules: [{required: true}]}]">
            <a-select-option :value="item.grade_id" v-for="item in gradeList" :key="item.grade_id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="form.getFieldValue('cateid') == 3" label="用户ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['cate_value', {initialValue: '',rules: [{required: true, message: '请输入用户ID'}]}]"
          />
        </a-form-item>
        <a-form-item label="是否弹窗" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['is_pop', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['is_image', {initialValue: 0, rules: [{required: true}]}]">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          v-if="form.getFieldValue('is_image') == 1"
          label="图片选择"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <SelectImage :multiple="false" v-decorator="['image_id']" />
        </a-form-item>
        <a-form-item v-if="visible" label="选择产品" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="如果不需要产品,则不选">
          <SelectGoods
            v-if="visible"
            :multiple="false"
            v-decorator="['goods_id', { initialValue: [], rules: [{ required: false, message: '请选择指定的产品' }] }]"
          />
        </a-form-item>
        <a-form-item v-show="!form.getFieldValue('is_image')" label="公告内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea :autoSize="{ minRows: 4, maxRows: 6 }" v-decorator="['content',{rules: [{required: true, min: 0, message: '请输入公告内容'}]}]" />
        </a-form-item>



        <a-form-item label="语言" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['language_id', {initialValue: languageList.length > 0 ? languageList[0].id : 0, rules: [{required: true}]}]">
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

import * as Api from '@/api/setting/notice'
// import * as GlobalApi from '@/api/globalization/code'
import * as LanguageApi from '@/api/globalization/language'
import * as GradeApi from '@/api/user/grade'
import { SelectGoods, SelectImage } from '@/components'

export default {
  components: { SelectImage, SelectGoods },
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
      gradeList: [],
      languageList: []
    }
  },
  created () {
    this.getLanguageList()
    this.getGradeList()
  },
  methods: {
    // 获取语言列表
    getLanguageList () {
      LanguageApi.all().then(response => {
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
    add () {
      this.title = '新增公告'
      this.visible = true
      this.goodsStatus = true
      // console.log(this.form.getFieldsValue())
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
      if (values.cateid == 1) {
        values.cate_value = 0
      }
      if (values.goods_id.length == 0) {
        values.goods_id = 0
      }
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
