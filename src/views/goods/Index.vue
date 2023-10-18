<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <!-- 搜索板块 -->
      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="关键词">
            <a-input v-decorator="['keyword']" placeholder="请输入产品名称" />
          </a-form-item>
          <a-form-item label="产品编码">
            <a-input v-decorator="['goodsNo']" placeholder="请输入产品编码" />
          </a-form-item>
          <a-form-item label="是否定期">
            <a-select v-decorator="['isfix', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="1">是</a-select-option>
              <a-select-option :value="0">否</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="是否推荐">
            <a-select v-decorator="['is_spread', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="1">是</a-select-option>
              <a-select-option :value="0">否</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="是否活动">
            <a-select v-decorator="['is_activity', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="1">是</a-select-option>
              <a-select-option :value="0">否</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="语言选择">
            <a-select v-decorator="['language_id', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="item.id" v-for="item in languageList" :key="item.id">
                {{ item.cname }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <!--          <a-form-item label="商品分类">-->
          <!--            <a-tree-select-->
          <!--              :treeData="categoryListTree"-->
          <!--              :dropdownStyle="{ maxHeight: '500px', overflow: 'auto' }"-->
          <!--              allowClear-->
          <!--              v-decorator="['categoryId', { initialValue: 0 }]"-->
          <!--            ></a-tree-select>-->
          <!--          </a-form-item>-->

          <a-form-item class="search-btn">
            <a-button type="primary" icon="search" html-type="submit">搜索</a-button>
          </a-form-item>
        </a-form>
      </a-row>
      <!-- 操作板块 -->
      <div class="row-item-tab clearfix">
        <!--        <div class="tab-list fl-l">-->
        <!--          <a-radio-group :defaultValue="queryParam.listType" @change="handleTabs">-->
        <!--            <a-radio-button value="all">全部</a-radio-button>-->
        <!--            <a-radio-button value="on_sale">出售中</a-radio-button>-->
        <!--            <a-radio-button value="off_sale">已下架</a-radio-button>-->
        <!--            <a-radio-button value="sold_out">已售罄</a-radio-button>-->
        <!--          </a-radio-group>-->
        <!--        </div>-->
        <a-button
          v-if="$auth('/goods/create')"
          class="fl-l"
          type="primary"
          icon="plus"
          @click="handleCreate"
        >创建产品</a-button>
        <div v-if="selectedRowKeys.length" class="button-group">
          <a-button-group class="ml-10">
            <a-button

              icon="arrow-up"
              @click="handleUpdateStatus(selectedRowKeys, true)"
            >上架</a-button>
            <a-button

              icon="arrow-down"
              @click="handleUpdateStatus(selectedRowKeys, false)"
            >下架</a-button>
            <a-button icon="delete" @click="handleDelete(selectedRowKeys)">删除</a-button>
          </a-button-group>
        </div>
      </div>
    </div>
    <!--    :scroll="{ x: 1450 }"-->
    <!--    :rowSelection="rowSelection"-->
    <s-table
      ref="table"
      rowKey="goods_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
      :scroll="{ x: 1450 }"
    >
      <!-- 商品图片 -->
      <span slot="goods_image" slot-scope="text">
        <a title="点击查看原图" :href="text" target="_blank">
          <img width="70" :src="text" alt="产品图片" />
        </a>
      </span>
      <!-- 商品名称 -->
      <span slot="goods_name" slot-scope="text">
        <p class="twoline-hide" style="width: 100px;">{{ text }}</p>
      </span>
      <!-- 商品状态 -->
      <span slot="status" slot-scope="text, item">
		 <!-- <a-tag
		    class="cur-p"
		    :color="text == 10 ? 'green' : 'red'"
		    @click="handleUpdateStatus([item.goods_id], text != 10)"
		  >{{ text == 10 ? '上架' : '下架' }}</a-tag> -->
        <a-tag
          class="cur-p"
          :color="text == 10 ? 'green' : 'red'"
        >{{ text == 10 ? '上架' : '下架' }}</a-tag>
      </span>
      <!--      库存相关-->
      <div slot="diyNum" slot-scope="item">
        <div>总量: <span style="color:red;">{{ Number(item.sales_actual) + Number(item.stock_total) }}</span></div>
        <div>剩余库存: <span style="color:red;">{{ item.stock_total }}</span></div>
        <div>销量: <span style="color:red;">{{ item.sales_actual }}</span></div>
        <div>限购数量: <span style="color:red;">{{ item.limit_num }}</span></div>
      </div>
<!--      activity-->
      <div slot="activity" slot-scope="item">
        <div>是否推广: <span style="color:red;">{{ item.is_spread ? '是' : '否' }}</span></div>
        <div>是否赠送: <span style="color:red;">{{ item.is_activity ? '是' : '否' }}</span></div>
        <div>是否分红: <span style="color:red;">{{ item.is_bonus ? '是' : '否' }}</span></div>
      </div>
      <!--      周期相关-->
      <div slot="diyDay" slot-scope="item">
        <div>产品价格: <span style="color:red;">{{ item.goods_price }}</span></div>
        <div>每日收益: <span style="color:red;">{{ item.daily_income }}</span></div>
        <div>返还天数: <span style="color:red;">{{ item.total_day }}</span> 天</div>
<!--        <div>返还本金: <span style="color:red;">{{ item.back_money }}</span></div>-->
      </div>
      <div slot="is_spread" slot-scope="text">
        <span v-if="text == 0">是</span>
        <span v-else>否</span>
      </div>
      <div slot="is_activity" slot-scope="text">
        <span v-if="text == 0">否</span>
        <span v-else>是</span>
      </div>
      <!--      定期相关-->
      <div slot="diyRegular" slot-scope="item">
        <div>定期: <span style="color:red;">{{ item.isfix == 0 ? '否' : '是' }}</span></div>
<!--        <div>金额: <span style="color:red;">{{ item.fix_money }}</span></div>-->
      </div>
      <!-- 操作项 -->
      <div class="actions" slot="action" slot-scope="text, item">
        <router-link :to="{ path: '/goods/update', query: { goodsId: item.goods_id } }">编辑</router-link>
        <br />
<!--        -->
        <a  @click="handleDelete([item.goods_id])">删除</a>
      </div>
    </s-table>
  </a-card>
</template>

<script>
import * as GoodsApi from '@/api/goods'
import * as LanguageApi from '@/api/globalization/language'
import { ContentHeader, STable } from '@/components'
import CategoryModel from '@/common/model/Category'

// 表格表头
const columns = [
  {
    title: '产品ID',
    dataIndex: 'goods_id',
    width: '70px'
  },
  {
    title: '产品名称',
    dataIndex: 'goods_name',
    // width: '302px',
    width: '110px',
    scopedSlots: { customRender: 'goods_name' }
  },
  {
    title: '产品图片',
    dataIndex: 'images[0].external_url',
    width: '80px',
    scopedSlots: { customRender: 'goods_image' }
  },
  // {
  //   title: '产品价格',
  //   dataIndex: 'goods_price'
  // },
  {
    title: '周期相关',
    width: '120px',
    scopedSlots: { customRender: 'diyDay' }
  },
  {
    title: '库存相关',
    width: '120px',
    scopedSlots: { customRender: 'diyNum' }
  },
  {
    title: '定期相关',
    width: '80px',
    scopedSlots: { customRender: 'diyRegular' }
  },
  {
    title: '活动状态',
    width: '80px',
    scopedSlots: { customRender: 'activity' }
  },
  // {
  //   title: '每日收益',
  //   dataIndex: 'daily_income'
  // },
  // {
  //   title: '产品天数',
  //   dataIndex: 'total_day'
  // },
  // {
  //   title: '限购数量',
  //   dataIndex: 'limit_num'
  // },
  // {
  //   title: '返还周期(天)',
  //   dataIndex: 'back_days'
  // },
  // {
  //   title: '返还本金',
  //   dataIndex: 'back_money'
  // },
  // {
  //   title: '总量'
  // },
  // {
  //   title: '销售量',
  //   dataIndex: 'sales_actual'
  // },
  // {
  //   title: '库存',
  //   dataIndex: 'stock_total'
  // },
  // {
  //   title: '总销量',
  //   dataIndex: 'sales_actual'
  // },
  // {
  //   title: '库存总量',
  //   dataIndex: 'stock_total'
  // },
  // {
  //   title: '状态',
  //   dataIndex: 'status',
  //   scopedSlots: { customRender: 'status' }
  // },
  {
    title: '结束时间',
    width: '130px',
    dataIndex: 'end_time'
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: '50px'
  },
  // {
  //   title: '是否推广',
  //   dataIndex: 'is_spread',
  //   scopedSlots: { customRender: 'is_spread' }
  // },
  // {
  //   title: '活动赠送',
  //   dataIndex: 'is_activity',
  //   scopedSlots: { customRender: 'is_activity' }
  // },
  {
    title: '使用语言',
    dataIndex: 'language.cname',
    width: '80px'
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '80px',
    scopedSlots: { customRender: 'status' }
  },
  // {
  //   title: '定期',
  //   dataIndex: 'isfix'
  // },
  // {
  //   title: '定期收益',
  //   dataIndex: 'fix_money'
  // },
  // {
  //   title: '添加时间',
  //   width: '180px',
  //   dataIndex: 'create_time'
  // },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'Index',
  components: {
    ContentHeader,
    STable
  },
  data () {
    return {
      // 语言列表
      languageList: [],
      // 当前表单元素
      searchForm: this.$form.createForm(this),
      // 商品分类列表
      categoryListTree: [],
      // 查询参数
      queryParam: {
        listType: 'all'
      },
      // 正在加载
      isLoading: false,
      // 表头
      columns,
      // 选择的元素
      selectedRowKeys: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return GoodsApi.list({ ...param, ...this.queryParam })
          .then(response => {
            return response.data.list
          })
      }
    }
  },
  created () {
    // 默认的查询参数
    if (this.$route.query.listType) {
      this.queryParam.listType = this.$route.query.listType
    }
    this.getLanguageList()
    // 获取商品分类列表
    // this.getCategoryList()
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    // 获取语言列表
    getLanguageList () {
      LanguageApi.all().then(response => {
        this.languageList = response.data.list.data
      })
    },

    /**
     * 选中项发生变化时的回调
     */
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },

    // 切换tab
    handleTabs (e) {
      this.queryParam.listType = e.target.value
      this.handleRefresh(true)
    },

    // 确认搜索
    handleSearch (e) {
      e.preventDefault()
      this.searchForm.validateFields((error, values) => {
        if (!error) {
          this.queryParam = { ...this.queryParam, ...values }
          this.handleRefresh(true)
        }
      })
    },

    // 重置搜索表单
    handleReset () {
      this.searchForm.resetFields()
    },

    // 获取分类列表
    getCategoryList () {
      this.isLoading = true
      CategoryModel.getListFromScreen()
        .then(selectList => {
          this.categoryListTree = selectList
        })
        .finally(result => {
          this.isLoading = false
        })
    },

    // 修改商品状态(上下架)
    handleUpdateStatus (goodsIds, state = true) {
      if (!this.$auth('/goods/index.status')) {
        return false
      }
      this.isLoading = true
      GoodsApi.state({ goodsIds, state })
        .then(result => {
          // 显示成功
          this.$message.success(result.message, 1.5)
          this.handleRefresh()
        })
        .finally(result => { this.isLoading = false })
    },

    /**
     * 删除记录
     */
    handleDelete (goodsIds) {
      const app = this
      const modal = this.$confirm({
        title: '您确定要删除该记录吗?',
        content: '删除后不可恢复',
        onOk () {
          console.log(goodsIds)
          return GoodsApi.deleted({ goods_id: goodsIds[0] })
            .then(result => {
              app.$message.success(result.message, 1.5)
              app.handleRefresh()
            })
            .finally(result => {
              modal.destroy()
            })
        }
      })
    },

    /**
     * 新增记录
     */
    handleCreate () {
      this.$router.push('/goods/create')
    },

    /**
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh (bool = false) {
      this.selectedRowKeys = []
      this.$refs.table.refresh(bool)
    }

  }
}
</script>
<style lang="less" scoped>
.ant-card-body {
  padding: 22px 29px 25px;
}
// 筛选tab
.tab-list {
  margin-right: 20px;
}
</style>
