<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="APP名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['app', { rules: [{ required: true, message: '请输入APP名称' }] }]"
          />
        </a-form-item>
        <a-form-item label="AppLogo" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <SelectImage
            :multiple="false"
            :default-list="record.logo ? [record.logo] : []"
            v-decorator="['logo_id', { rules: [{ required: true, message: '请选择AppLogo' }] }]"
          />
        </a-form-item>
        <a-form-item label="前端域名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['domain', { rules: [{ required: true, message: '请输入前端域名' }] }]"
          />
        </a-form-item>
        <a-form-item label="推广标识" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['mark', { rules: [{ required: true, message: '请输入标识id' }] }]"
          />
        </a-form-item>
        <a-form-item label="默认语言" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['language', { initialValue: langList.find(e => e.code === 'en-us') ? langList.find(e => e.code === 'en-us').cname : 3 }]">
            <a-select-option
              v-for="item in langList"
              :key="item.id"
              :value="item.id"
            >{{ item.cname }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="国家区号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['area_code', { initialValue: codeList[0] ? codeList[0].code : ''}]">
            <a-select-option
              v-for="item in codeList"
              :key="item.id"
              :value="item.id"
            >{{ item.cname }} - {{ item.code }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="货币标识" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['currency', { rules: [{ required: true, message: '请输入货币标识' }] }]"
          />
        </a-form-item>


        <a-form-item label="货币简写" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['currency_short', { rules: [{ required: true, message: '请输入货币简写' }] }]"
          />
        </a-form-item>
        <a-form-item label="分享地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['share_url', { rules: [{ required: true, message: '请输入分享地址' }] }]"
          />
        </a-form-item>
        <a-form-item label="简短描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            placeholder="请输入简短描述 (300个字符以内)"
            :autoSize="{ minRows: 4 }"
            v-decorator="['describe']"
          />
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
import { InputNumberGroup, SelectImage } from '@/components'

export default {
  components: {
    SelectImage,
    InputNumberGroup
  },
  data () {
    return {
      // 当前设置项的key
      key: 'basic',
      // 标签布局属性
      labelCol: { span: 4 },
      // 输入框布局属性
      wrapperCol: { span: 10 },
      // loading状态
      isLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this),
      // 语言列表
      langList: [],
      codeList: [],
      // 当前记录详情
      record: {},
    }
  },
  // 初始化数据
  created () {
    // 获取当前详情记录
    this.getDetail()
    this.getAllLangList()
    this.getAllCode()
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
    getAllCode () {
      CodeApi.all()
        .then(result => {
          this.codeList = result.data.list.data
        })
    },
    // 获取所有语言列表
    getAllLangList () {
      LangApi.all()
        .then(result => {
          this.langList = result.data.list.data
        })
    },

    /**
     * 设置默认值
     */
    setFieldsValue () {
      const { record, $nextTick, form: { setFieldsValue } } = this
      $nextTick(() => {
        setFieldsValue(pick(record, ['app', 'domain', 'mark', 'language', 'area_code', 'currency', 'currency_short', 'describe', 'logo', 'share_url']))
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
