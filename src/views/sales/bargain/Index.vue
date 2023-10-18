<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-col :span="2">
          <a-button  type="primary" icon="plus" @click="handleAdd">新增</a-button>
        </a-col>
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="状态">
            <a-select v-decorator="['status', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="0">关闭</a-select-option>
              <a-select-option :value="1">开启</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="时间范围">
            <a-range-picker format="YYYY-MM-DD HH:mm:ss" v-decorator="['betweenTime']" />
          </a-form-item>
          <a-form-item class="search-btn">
            <a-button type="primary" icon="search" html-type="submit">搜索</a-button>
          </a-form-item>
        </a-form>
      </a-row>
    </div>
    <s-table
      ref="table"
      rowKey="language_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
      <div slot="goods_item" slot-scope="item">
        <div>产品ID: <span style="color: red;">{{ item.goods_id }}</span></div>
        <div>产品名称: <span class="twoline-hide" style="color: red;">{{ item.goods_name }}</span></div>
        <div>返还本金: <span style="color: red">{{ item.back_money }}</span></div>
      </div>
      <div slot="activity_time" slot-scope="item">
        <div>有效期: <span style="color: red;">{{ item.expiryt_time }} 小时</span></div>
        <div>创建时间: <span style="color: red;">{{ item.create_time }}</span></div>
        <div>结束时间: <span style="color: red">{{ item.end_time }}</span></div>
      </div>
      <div slot="status" slot-scope="item">
        <div>状态: <span style="color: red;">{{ item.status_label }}</span></div>
        <div>帮砍人数: <span style="color: red;">{{ item.peoples }}</span></div>
        <div>底价购买: <span style="color: red">{{ item.is_floor_buy }}</span></div>
        <div>自砍一刀: <span style="color: red">{{ item.is_self_cut }}</span></div>
        <div>砍价底价: <span style="color: red">{{ item.floor_price }}</span></div>
      </div>
      <div slot="sales" slot-scope="item">
        <div>限购数量: <span style="color: red;">{{ item.limit_num }}</span></div>
        <div>库存数量: <span style="color: red;">{{ item.stock_num }}</span></div>
        <div>实际销量: <span style="color: red">{{ item.actual_sales }}</span></div>
        <div>虚拟销量: <span style="color: red">{{ item.initial_sales }}</span></div>
      </div>
      <div class="actions" slot="action" slot-scope="text, item">
        <a  @click="handleEdit(item)">编辑</a>
        <a  @click="handleDelete(item)">删除</a>
      </div>
    </s-table>
    <AddForm ref="AddForm" @handleSubmit="handleRefresh" />
    <EditForm ref="EditForm" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as Api from '@/api/sales/bargain'
import { STable } from '@/components'
import AddForm from './modules/AddForm'
import EditForm from './modules/EditForm'

export default {
  name: 'Index',
  components: {
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
      // 表头
      columns: [
        {
          title: '编号ID',
          dataIndex: 'id'
        },
        {
          title: '产品',
          dataIndex: 'goods',
          width: '150px',
          scopedSlots: { customRender: 'goods_item' }
        },
        // {
        //   title: '砍价底价',
        //   dataIndex: 'floor_price'
        // },
        // {
        //   title: '帮砍人数',
        //   dataIndex: 'peoples'
        // },
        // {
        //   title: '自砍',
        //   dataIndex: 'is_self_cut'
        // },
        // {
        //   title: '限购数量',
        //   dataIndex: 'limit_num'
        // },
        // {
        //   title: '库存数量',
        //   dataIndex: 'stock_num'
        // },
        // {
        //   title: '底价购买',
        //   dataIndex: 'is_floor_buy'
        // },
        {
          title: '砍价助力语',
          dataIndex: 'prompt_words'
        },
        // {
        //   title: '实际销量',
        //   dataIndex: 'actual_sales'
        // },
        // {
        //   title: '虚拟销量',
        //   dataIndex: 'initial_sales'
        // },
        {
          title: '状态/配置',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '销量',
          scopedSlots: { customRender: 'sales' }
        },
        {
          title: '活动时间',
          scopedSlots: { customRender: 'activity_time' }
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
  },
  methods: {

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
          console.log(values)
          this.queryParam = { ...this.queryParam, ...values }
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
