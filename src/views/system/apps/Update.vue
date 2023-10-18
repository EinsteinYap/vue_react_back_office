<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="安卓更新包下载地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['androidlink', { rules: [{ required: true, message: '请输入安卓更新包下载地址' }] }]"
          />
          <span v-if="upUrl">已更新上传包地址</span>
        </a-form-item>
        <a-form-item label="安卓更新包上传" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <div class="file-upload fl-l">
            <a-upload
              name="iFile"
              :accept="accept"
              :beforeUpload="beforeUpload"
              :customRequest="onUpload"
              :multiple="false"
              :showUploadList="false"
            >
              <a-button icon="cloud-upload">上传</a-button>
            </a-upload>
          </div>
        </a-form-item>
        <a-form-item label="安卓版本号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['androidversion', { rules: [{ required: true, message: '请输入安卓版本号' }] }]"
          />
        </a-form-item>
        <a-form-item label="IOS版本号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['iosversion', { rules: [{ required: true, message: '请输入IOS版本号' }] }]"
          />
        </a-form-item>
        <a-form-item label="IOS链接地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['ioslink', { rules: [{ required: true, message: '请输入IOS链接地址' }] }]"
          />
        </a-form-item>

        <a-form-item label="更新方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['method', { initialValue: '0', rules: [{ required: true }] }]"
          >
            <a-radio value="0">强制</a-radio>
            <a-radio value="1">手动</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="更新标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['update_title', { rules: [{ required: true, message: '请输入更新标题' }] }]"
          />
        </a-form-item>
        <a-form-item label="更新内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['update_content', { rules: [{ required: true, message: '请输入更新内容' }] }]"
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
import * as UploadApi from '@/api/upload'
import { InputNumberGroup, SelectImage } from '@/components'
import { debounce } from '@/utils/util'

export default {
  components: {
    SelectImage,
    InputNumberGroup
  },
  data () {
    return {
      // 后端上传api
      uploadUrl: UploadApi.annex,
      // 上传中的文件
      uploading: [],
      upUrl: "",
      // 文件上传的格式限制
      accept: '',
      // 当前设置项的key
      key: 'upgrade_apk',
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

    // 事件: 上传文件之前
    beforeUpload (file, fileList) {
      // 显示错误提示(防抖处理)
      const showErrorMsg = debounce(this.$message.error, 20)
      // 验证文件大小
      const fileSizeMb = file.size / 1024 / 1024
      if (fileSizeMb > this.uploadSizeLimit) {
        showErrorMsg(`上传的文件大小不能超出${this.uploadSizeLimit}MB`)
        return false
      }
      // 验证文件上传数量
      if (fileList.length > 10) {
        showErrorMsg('一次上传的文件数量不能超出10个')
        return false
      }
      return true
    },

    // 事件: 自定义上传
    onUpload (info) {
      this.isLoading = true
      // 记录上传状态
      this.uploading.push(true)
      // 构建上传参数
      const formData = new FormData()
      formData.append('iFile', info.file)
      // formData.append('groupId', this.queryParam.groupId)
      // 开始上传
      this.uploadUrl(formData)
        .then(result => {
          console.log(result)
          // 上传成功
          if (result.status === 200) {
            this.$message.success(result.message, 1.5)
            this.upUrl = result.data.fileInfo.external_url
            this.form.setFieldsValue({ androidlink: this.upUrl })
          } else {
            // 上传失败
            this.$message.error(result.message)
            this.upUrl = ''
          }
        })
        .finally(() => {
          this.uploading.pop()
          if (this.uploading.length === 0) {
            this.isLoading = false
            // this.getDetail()
          }
        })
    },
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
        setFieldsValue(pick(record, [
          'androidlink',
          'androidversion',
          'iosversion',
          'ioslink',
          'method',
          'update_title',
          'update_content',
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
          this.upUrl = ''
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
