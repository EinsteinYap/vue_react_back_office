<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-col :span="2">
          <a-button  type="primary" icon="plus" @click="handleAdd">新增</a-button>
        </a-col>
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="类型">
            <a-select v-decorator="['cateid', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="1">所有人</a-select-option>
              <a-select-option :value="2">等级用户</a-select-option>
              <a-select-option :value="3">单个用户</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="时间范围">
            <a-range-picker format="YYYY-MM-DD" v-decorator="['betweenTime']" />
          </a-form-item>
          <a-form-item class="search-btn">
            <a-button type="primary" icon="search" html-type="submit">搜索</a-button>
          </a-form-item>
        </a-form>
      </a-row>
    </div>
    <s-table
      ref="table"
      rowKey="notice_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
      <div slot="goods_info" slot-scope="item">
        <div v-if="item">产品ID: <span style="color: red">{{ item.goods_id }}</span></div>
        <div v-if="item">产品名称: <span style="color: red">{{ item.goods_name }}</span></div>
        <div v-if="item">返还金额: <span style="color: red">{{ item.back_money }}</span></div>
        <div v-if="item">产品金额: <span style="color: red">{{ item.goods_price }}</span></div>
        <div v-else>无产品</div>
      </div>
      <div slot="content" slot-scope="text">
        <p style="max-width: 170px;white-space: pre-wrap">{{ text }}</p>
      </div>
      <div slot="language_info" slot-scope="item">
        <div>语言ID: <span style="color: red">{{ item.id }}</span></div>
        <div>语言名称: <span style="color: red">{{ item.cname }}</span></div>
      </div>
      <div class="actions" slot="action" slot-scope="text, item">
        <a  @click="handleEdit(item)">编辑</a>
        <a  @click="handleDelete(item)" style="margin-right: 10px;">删除</a>
      </div>
    </s-table>
    <AddForm ref="AddForm" @handleSubmit="handleRefresh" />
    <EditForm ref="EditForm" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as Api from '@/api/setting/notice'
import { SelectGoods, STable } from '@/components'
import AddForm from './modules/AddForm'
import EditForm from './modules/EditForm'
// import * as LanguageApi from '@/api/globalization/language'

export default {
  name: 'Index',
  components: {
    SelectGoods,
    STable,
    AddForm,
    EditForm
  },
  data () {
    return {
      // 正在加载
      isLoading: false,
      // 查询参数
      queryParam: {},
      languageList: [],
      // 表头
      columns: [
        {
          title: '公告ID',
          dataIndex: 'id'
        },
        {
          title: '公告内容',
          dataIndex: 'content',
          scopedSlots: { customRender: 'content' }
        },
        {
          title: '公告类型',
          dataIndex: 'cate_label'
        },
        {
          title: '产品',
          dataIndex: 'goods',
          scopedSlots: { customRender: 'goods_info' }
        },
        {
          title: '发布时间',
          dataIndex: 'create_time'
        },
        {
          title: '语言',
          dataIndex: 'language',
          scopedSlots: { customRender: 'language_info' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '180px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.list({ ...param, ...this.queryParam })
          .then(response => {
            return response.data.list
          })
      },
      // 当前表单元素
      searchForm: this.$form.createForm(this)
    }
  },
  created () {
    // this.getLanguageList()
  },
  methods: {
    // // 获取语言列表
    // getLanguageList () {
    //   LanguageApi.all().then(response => {
    //     this.languageList = response.data.list.data
    //   })
    // },
    /**
     * 新增记录
     */
    handleAdd () {
      this.$refs.AddForm.add()
    },

    copyDown (item) {
      this.$copyText(item.downurl).then(message => {
        console.log('copy', message)
        this.$message.success('复制完毕')
      }).catch(err => {
        console.log('copy.err', err)
        this.$message.error('复制失败')
      })
    },

    /**
     * 编辑记录
     */
    handleEdit (item) {
      this.$refs.EditForm.edit(item)
    },

    /**
     * 删除记录
     */
    handleDelete (item) {
      const app = this
      const modal = this.$confirm({
        title: '您确定要删除该记录吗?',
        content: '删除后不可恢复',
        onOk () {
          return Api.deleted({ id: item.id })
            .then((result) => {
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
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh (bool = false) {
      this.$refs.table.refresh(bool)
    },

    // 确认搜索
    handleSearch (e) {
      e.preventDefault()
      this.searchForm.validateFields((error, values) => {
        if (!error) {
          const newValues = {
            ...values
          }

          this.queryParam = { ...this.queryParam, ...newValues }
          this.handleRefresh(true)
        }
      })
    }

  }
}
</script>

<style lang="less" scoped>
.flex-center {
  display: flex;
  flex-direction: column;
  //justify-content: center;
  align-items: flex-start;

  > span {
    display: inline-flex;
    margin-bottom: 4px;
  }
}

</style>
