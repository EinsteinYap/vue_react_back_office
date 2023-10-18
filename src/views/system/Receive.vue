<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">

        <a-form-item :label="`第${item.level}层`" :labelCol="labelCol" :wrapperCol="wrapperCol" v-for="(item, index) in record" :key="item[index]">
          <a-input-number
            :min="0"
            :max="100"

            v-model="record[index].rate"
            style="margin-right: 10px"
          />
          <span style="margin-left: -5px;">%</span>
          <a-checkbox style="margin-left: 45px;" class="newcheckbox" v-model="record[index].purchase">
            <span style="margin-left: -55px;">自购</span>
          </a-checkbox>
          <!--          purchase-->
          <!--          v-decorator="[`${record[index].rate}`, {initialValue: 1, rules: [{required: true, message: '请输入比例'}]}]"-->
        </a-form-item>
        <a-form-item :wrapper-col="{ span: wrapperCol.span, offset: labelCol.span }">
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
import { pick, omit } from 'lodash'
import { isEmpty } from '@/utils/util'
import * as Api from '@/api/setting/store'

export default {
  data () {
    return {
      // 当前设置项的key
      key: 'bonus',
      // 标签布局属性
      labelCol: { span: 3 },
      // 输入框布局属性
      wrapperCol: { span: 10 },
      // loading状态
      isLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this),
      // 当前记录详情
      record: {}
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
          console.log(result.data.values)
          // 当前记录
          this.record = result.data.values
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
      const app = this
      const { record, $nextTick, form } = app
      // console.log(record)
      !isEmpty(form.getFieldsValue()) && $nextTick(() => {
        form.setFieldsValue(pick(record, ['rate', 'level', 'purchase']))
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
      const newPost = { ...this.record }
      Api.update(this.key, { form: this.record })
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
  margin-bottom: 10px;
}
/deep/.ant-form-item-control {
  padding-left: 10px;

  .ant-form-item-control {
    padding-left: 0;
  }
}
.ant-divider {
  margin-top: 50px !important;
}
</style>
