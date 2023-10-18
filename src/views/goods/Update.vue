<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit" :selfUpdate="true">
        <a-tabs :activeKey="tabKey" :tabBarStyle="{marginBottom: '30px'}" @change="handleTabs">
          <a-tab-pane :key="0" tab="基本信息"></a-tab-pane>
          <!--          <a-tab-pane :key="1" tab="规格/库存"></a-tab-pane>-->
          <a-tab-pane :key="2" tab="产品详情"></a-tab-pane>
          <!--          <a-tab-pane :key="3" tab="更多设置"></a-tab-pane>-->
        </a-tabs>
        <div class="tabs-content">
          <!-- 基本信息 -->
          <div class="tab-pane" v-show="tabKey == 0">
            <a-form-item label="产品名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入产品名称"
                v-decorator="['goods_name', { rules: [{ required: true, min: 2, message: '请输入至少2个字符' }] }]"
              />
            </a-form-item>
            <a-form-item
              label="产品图片"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              extra="建议尺寸：750*750像素, 最多上传10张, 可拖拽图片调整顺序, 第1张将作为产品首图"
            >
              <SelectImage
                multiple
                :maxNum="10"
                :defaultList="formData.goods.images"
                v-decorator="['images', { rules: [{ required: true, message: '请至少上传1张产品图片' }] }]"
              />
            </a-form-item>
<!--            <a-form-item-->
<!--              label="主图视频"-->
<!--              :labelCol="labelCol"-->
<!--              :wrapperCol="wrapperCol"-->
<!--              extra="建议视频宽高比19:9，建议时长8-45秒"-->
<!--            >-->
<!--              <SelectVideo-->
<!--                :multiple="false"-->
<!--                :defaultList="formData.goods.video ? [formData.goods.video] : []"-->
<!--                v-decorator="['video_id']"-->
<!--              />-->
<!--            </a-form-item>-->
<!--            <a-form-item-->
<!--              label="视频封面"-->
<!--              :labelCol="labelCol"-->
<!--              :wrapperCol="wrapperCol"-->
<!--              extra="建议尺寸：750像素*750像素"-->
<!--            >-->
<!--              <SelectImage-->
<!--                :multiple="false"-->
<!--                :defaultList="formData.goods.video_cover ? [formData.goods.video_cover] : []"-->
<!--                v-decorator="['video_cover_id']"-->
<!--              />-->
<!--            </a-form-item>-->
            <a-form-item
              label="产品价格"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              extra="产品的实际购买金额，最低0.01"
            >
              <a-input-number
                :min="0.01"
                :precision="2"
                v-decorator="['goods_price', { initialValue: 1, rules: [{ required: true, message: '请输入产品价格' }] }]"
              />
              <span class="ml-10">{{ currency_short }}</span>
            </a-form-item>
            <a-divider orientation="left">库存相关</a-divider>
            <a-form-item
              label="库存数量"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              extra="产品的实际库存数量，为0时用户无法下单"
            >
              <a-input-number
                :min="0"
                :precision="0"
                v-decorator="['stock_total', { initialValue: 100, rules:[{ required: true, message: '请输入产品数量' }] }]"
              />
              <span class="ml-10">件</span>
            </a-form-item>
            <a-form-item
              label="初始销量"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              extra="用户端展示的销量 = 初始销量 + 实际销量"
            >
              <a-input-number v-decorator="['sales_initial', {initialValue: 0}]" />
            </a-form-item>
            <a-form-item
              label="限购数量"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              extra="用户端展示的限购数量"
            >
              <a-input-number v-decorator="['limit_num', {initialValue: 0}]" />
            </a-form-item>
            <a-divider orientation="left">周期设置</a-divider>

<!--            <a-form-item label="返还天数" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--              <a-input-number-->
<!--                :min="0"-->
<!--                v-decorator="['total_day', {initialValue: 0, rules:[{ required: true, message: '请输入返还天数' }]}]"-->
<!--              />-->
<!--            </a-form-item>-->
<!--            <a-form-item label="返还本金" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--              <a-input-number-->
<!--                :step="0.01"-->
<!--                :min="0.00"-->
<!--                v-decorator="['back_money', {initialValue: 0, rules:[{ required: true, message: '请输入返还本金'}]}]"-->
<!--              />-->
<!--            </a-form-item>-->

<!--            <a-form-item label="总天数" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--              <a-input-number-->
<!--                :min="0"-->
<!--                v-decorator="['total_day', {initialValue: 0, rules:[{ required: true, message: '请输入总天数' }]}]"-->
<!--              />-->
<!--            </a-form-item>-->

            <a-form-item label="结算模式" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-radio-group
                @change="changeSettleModel"
                v-decorator="['settle_model', {initialValue: formData.goods.settle_model , rules: [{ required: true }]}]"
              >
                <a-radio :value="1">先息后本</a-radio>
                <a-radio :value="2">还本返息</a-radio>
                <a-radio :value="3">定期还本返息</a-radio>
                <a-radio :value="4">翻倍</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item v-if="formData.goods.settle_model == 3" label="定期总收益" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number
                :min="0"
                v-decorator="['profit_total', {initialValue: formData.goods.profit_total, rules:[{ required: true, message: '请输入定期总收益' }]}]"
              />
            </a-form-item>

            <a-form-item v-if="formData.goods.settle_model != 3" :label="formData.goods.settle_model == 4 ? '翻倍基数': '每日收益'" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number
                :step="0.01"
                :min="0"
                v-decorator="['daily_income', {initialValue: 0, rules:[{ required: true, message: '请输入每日收益' }]}]"
              />
            </a-form-item>
            <a-form-item label="返还天数" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number
                :min="0"
                v-decorator="['total_day', {initialValue: 0, rules:[{ required: true, message: '请输入返还天数' }]}]"
              />
            </a-form-item>
            <a-divider orientation="left">状态设置</a-divider>
            <a-form-item label="是否推荐奖励" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-radio-group
                v-decorator="['is_spread', {initialValue: 1, rules: [{ required: true }]}]"
              >
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="是否分红奖励" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-radio-group
                v-decorator="['is_bonus', {initialValue: 1, rules: [{ required: true }]}]"
              >
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="是否属于活动赠送" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-radio-group
                v-decorator="['is_activity', {initialValue: 1, rules: [{ required: true }]}]"
              >
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
            </a-form-item>
<!--            <a-form-item label="是否定期" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
<!--              <a-radio-group-->
<!--                @change="fixChange"-->
<!--                v-decorator="['isfix', {initialValue: 1, rules: [{ required: true }]}]"-->
<!--              >-->
<!--                <a-radio :value="1">是</a-radio>-->
<!--                <a-radio :value="0">否</a-radio>-->
<!--              </a-radio-group>-->
<!--            </a-form-item>-->
            <a-form-item v-if="is_fix_show" label="定期金额" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="如果定期选择否则无效">
              <a-input-number
                :min="0"
                :step="0.01"
                v-decorator="['fix_money', {initialValue: 0, rules:[{ required: true }]}]"
              />
            </a-form-item>
            <a-form-item label="到期时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-date-picker  show-time format="YYYY-MM-DD HH:mm" v-decorator="['end_time', { initialValue: formData.goods.end_time }]" />
            </a-form-item>
            <a-divider orientation="left">其他设置</a-divider>
            <a-form-item label="语言选择" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="每个产品只能选择单个语言,如需多语言请添加多个产品">
              <a-select v-decorator="['language_id', { initialValue: formData.goods.language_id }]">
                <a-select-option :value="item.id" v-for="item in languageList" :key="item.id">
                  {{ item.cname }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="产品状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-radio-group
                v-decorator="['status', {initialValue: 10, rules: [{ required: true }]}]"
              >
                <a-radio :value="10">上架</a-radio>
                <a-radio :value="20">下架</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="产品排序" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="数字越小越靠前">
              <a-input-number
                :min="0"
                v-decorator="['sort', {initialValue: 100, rules:[{ required: true }]}]"
              />
            </a-form-item>
          </div>

          <!-- 商品详情 -->
          <div class="tab-pane" v-show="tabKey == 2">
            <a-form-item label="产品详情" :labelCol="labelCol" :wrapperCol="{span: 16}">

              <Ueditor v-decorator="['content', {rules: [{required: true, message: '产品详情不能为空'}]}]" />
            </a-form-item>
          </div>

        </div>
        <a-form-item class="mt-20" :wrapper-col="{ span: wrapperCol.span, offset: labelCol.span }">
          <a-button type="primary" html-type="submit" :loading="isBtnLoading">提交</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
import * as GoodsApi from '@/api/goods'
import { SelectImage, SelectVideo, Ueditor, InputNumberGroup } from '@/components'
import GoodsModel from '@/common/model/goods/newIndex'
import MultiSpec from './modules/MultiSpec'
import { isEmptyObject } from '@/utils/util'
import * as LanguageApi from '@/api/globalization/language'

export default {
  components: {
    SelectImage,
    SelectVideo,
    Ueditor,
    InputNumberGroup,
    MultiSpec
  },
  data () {
    return {
      currency_short: localStorage.getItem('currency_short'),
      // 语言列表
      languageList: [],
      // 默认的标签索引
      tabKey: 0,
      // 标签布局属性
      labelCol: { span: 3 },
      // 输入框布局属性
      wrapperCol: { span: 10 },
      // loading状态
      isLoading: false,
      isBtnLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this),
      // 商品ID
      goodsId: null,
      // 表单数据
      formData: GoodsModel.formData,
      is_fix_show: true
    }
  },
  async created () {
    // 初始化数据
    await this.getLanguageList()
    this.initData()
  },
  beforeDestroy () {
    // 销毁商品详情
    GoodsModel.formData.goods = {}
  },
  methods: {
    changeSettleModel(el) {
      this.formData.goods.settle_model = el.target.value
    },
    fixChange (el) {
      this.is_fix_show = el.target.value
    },
    getLanguageList () {
      LanguageApi.all().then(response => {
        this.languageList = response.data.list.data
      })
    },
    // 初始化数据
    initData () {
      // 记录商品ID
      this.goodsId = this.$route.query.goodsId
      // 获取form所需的数据
      this.isLoading = true
      GoodsModel.getFromData(this.goodsId)
        .then(() => {
          // 商品表单数据
          if (!isEmptyObject(this.form.getFieldsValue())) {

            this.form.setFieldsValue(GoodsModel.getFieldsValue())
            this.is_fix_show = GoodsModel.getFieldsValue().isfix
          }
          this.isLoading = false
        })
    },

    // 手动强制更新页面
    onForceUpdate (bool = false) {
      this.$forceUpdate()
      // bool为true时再执行一次 $forceUpdate, 特殊情况下需执行两次，原因如下：
      // 第一次执行 $forceUpdate时, 新元素绑定v-decorator无法获取到form.getFieldValue
      bool && setTimeout(() => {
        this.$forceUpdate()
      }, 10)
    },

    // 切换tab选项卡
    handleTabs (key) {
      this.tabKey = key
    },

    // 刷新分类列表
    onReloadCategoryList () {
      this.isLoading = true
      GoodsModel.getCategoryList().then(() => {
        this.isLoading = false
      })
    },

    // 刷新服务与承诺列表
    onReloadServiceList () {
      this.isLoading = true
      GoodsModel.getServiceList().then(() => {
        this.isLoading = false
      })
    },

    // 刷新配送模板列表
    onReloadDeliveryList () {
      this.isLoading = true
      GoodsModel.getDeliveryList().then(() => {
        this.isLoading = false
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
        // 定位到错误的tab选项卡
        if (errors) {
          this.onTargetTabError(errors)
          return false
        }
        // 验证多规格
        // if (values.spec_type === 20) {
        //   const MultiSpec = this.$refs.MultiSpec
        //   if (!MultiSpec.verifyForm()) {
        //     this.tabKey = 1
        //     return false
        //   }
        //   // 记录多规格数据
        //   values.specData = MultiSpec.getFromSpecData()
        // }
        // // 整理商品分类ID集
        // values.categoryIds = values.categorys.map(item => item.value)
        // delete values.categorys
        // 提交到后端api
        this.onFormSubmit(values)
        return true
      })
    },

    /**
     * 定位到错误的tab选项卡
     */
    onTargetTabError (errors) {
      // 表单字段与tabKey对应关系
      // 只需要必填字段就可
      const tabsFieldsMap = [
        ['goods_name', 'categorys', 'images', 'delivery_id', 'is_bonus'],
        ['spec_type', 'goods_price'],
        ['content'],
        ['alone_grade_equity', 'first_money', 'second_money', 'third_money']
      ]
      const field = Object.keys(errors).shift()
      for (const key in tabsFieldsMap) {
        if (tabsFieldsMap[key].indexOf(field) > -1) {
          this.tabKey = parseInt(key)
          break
        }
      }
    },

    /**
    * 提交到后端api
    */
    onFormSubmit (values) {
      this.isLoading = true
      this.isBtnLoading = true

      console.log('values', values)


      if (values.images) {
        values.images = values.images.map(item => {
          if (item.file_id) {
            return item.file_id
          } else {
            return item
          }
        })
      }

      if (!values.end_time) {
        values.end_time = ''
      }

      GoodsApi.edit({ goodsId: this.goodsId, form: values })
        .then(result => {
          // 显示提示信息
          this.$message.success(result.message, 1.5)
          // 跳转到列表页
          setTimeout(() => {
            this.$router.push('./index')
          }, 1500)
        })
        .catch(() => {
          this.isBtnLoading = false
        })
        .finally(() => {
          this.isLoading = false
        })
    }

  }
}

</script>
<style lang="less" scoped>
@import './style.less';
</style>
