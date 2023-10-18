<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
        </a-form-item>
		<a-form-item label="直推奖励比例" :labelCol="labelCol" :wrapperCol="wrapperCol">

		  <a-input-number
		    :min="0"
			:max="100"
		    v-decorator="['rate', { initialValue: 0, rules: [{ required: true, message: '请输入赠送金额' }] }]"
		  style="margin-right: 5px"
		  />
		  <span >%</span>
		</a-form-item>
        <a-form-item :wrapper-col="{ span: wrapperCol.span, offset: labelCol.span }">
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import * as Api from '@/api/setting/store'
import * as LangApi from '@/api/globalization/language'
import * as CodeApi from '@/api/globalization/code'
import * as UploadApi from '@/api/upload'
import { InputNumberGroup, SelectImage } from '@/components'
import { debounce } from '@/utils/util'
import * as CouponApi from '@/api/market/coupon'

export default {
  components: {
    SelectImage,
    InputNumberGroup
  },
  data () {
    return {
      // 当前设置项的key
      key: 'laxin_award',
      // 标签布局属性
      labelCol: { span: 4 },
      // 输入框布局属性
      wrapperCol: { span: 10 },
      // loading状态
      isLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this),
      // 语言列表
      // 当前记录详情
      record: {},
    }
  },
  // 初始化数据
  created () {
    // 获取当前详情记录
    this.getDetail()
  },
  methods: {

    // 获取当前详情记录
    getDetail () {
      this.isLoading = true
      Api.detail(this.key)
        .then(result => {
          // 当前记录
          this.record = result.data.values
          this.record = { ...this.record, logo: result.data.data.logo }
          // 设置默认值
          this.setFieldsValue()
        })
        .finally(result => {
          this.isLoading = false
        })
    },

    /**
     * 设置默认值
     */
    setFieldsValue () {
      const { record, $nextTick, form: { setFieldsValue } } = this
      $nextTick(() => {
        setFieldsValue(pick(record, [
          'status',
          'rate'
        ]))
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
     * 提交到后端api
     */
    onFormSubmit (values) {
      this.isLoading = true
      Api.update(this.key, { form: values })
        .then((result) => {
          // 显示提示信息
          this.$message.success(result.message, 1.5)
        })
        .finally((result) => {
          this.isLoading = false
        })
    }

  }
}
</script>
<style lang="less" scoped>
.ant-form-item {
  .ant-form-item {
    margin-bottom: 0;
  }
}

/deep/.ant-form-item-control {
  padding-left: 10px;
  .ant-form-item-control {
    padding-left: 0;
  }
}
</style>
