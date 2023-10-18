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
      <div slot="images" slot-scope="item">
        <img @click="openImages(item)" style="width: 50px;" :src="item.image_url">
      </div>
      <div slot="amount_rate" slot-scope="item">
        <div>众筹金额: <span style="color: red;">{{ item.amount }}%</span></div>
        <div>进度最大值: <span style="color: red;">{{ item.max_rate }}%</span></div>
        <div>模拟进度: <span style="color: red;">{{ item.fix_rate }}%</span></div>
        <div>自增进度: <span style="color: red;">{{ item.self_increment }}%</span></div>
      </div>
      <div slot="progress" slot-scope="item">
        <div>收益比例: <span style="color: red;">{{ item.profit_rate }}%</span></div>
        <div>最小投资金额: <span style="color: red;">{{ item.min_buy_amount }}</span></div>
        <div>最大投资金额: <span style="color: red;">{{ item.max_buy_amount }}</span></div>
        <div>结算模式: <span style="color: red;">{{ item.settle_model_label }}</span></div>
      </div>
      <div slot="limit_sales" slot-scope="item">
        <div>已筹金额: <span style="color: red;">{{ item.buy_total_price }}</span></div>
        <div>众筹人数: <span style="color: red;">{{ item.buy_num }}</span></div>
        <div>当前进度: <span style="color: red;">{{ item.rate ? item.rate : 0 }}%</span></div>
      </div>
      <div slot="active" slot-scope="item">
        <div>推荐奖励: <span style="color: red;">{{ item.is_spread ? '是' : '否' }}</span></div>
        <div>分红奖励: <span style="color: red;">{{ item.is_bonus ? '是' : '否' }}</span></div>
        <div>创建时间: <span style="color: red;">{{ item.create_time }}</span></div>
<!--        <div>结束时间: <span style="color: red;">{{ item.end_time }}</span></div>-->
      </div>

      <div slot="status_label" slot-scope="item">
        <a-tag v-if="item.status == 0" color="red">关闭</a-tag>
        <a-tag v-if="item.status == 1" color="green">正常</a-tag>
      </div>
      <div class="actions" slot="action" slot-scope="text, item">
        <a  @click="handleEdit(item)">编辑</a>
        <br />
        <a  @click="handleDelete(item)">删除</a>
      </div>
    </s-table>
    <AddForm ref="AddForm" @handleSubmit="handleRefresh" />
    <EditForm ref="EditForm" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as Api from '@/api/sales/crowd'
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
          title: '众筹ID',
          dataIndex: 'id'
        },
        // {
        //   title: '众筹金额',
        //   dataIndex: 'amount',
        // },
        {
          title: '产品图片',
          scopedSlots: { customRender: 'images' }
        },
        {
          title: '金额/比例',
          scopedSlots: { customRender: 'amount_rate' }
        },
        {
          title: '进度',
          scopedSlots: { customRender: 'progress' }
        },
        {
          title: '众筹状态',
          scopedSlots: { customRender: 'limit_sales' }
        },

        {
          title: '活动状态',
          scopedSlots: { customRender: 'active' }
        },

        // {
        //   title: '已购金额',
        //   dataIndex: 'buy_total_price'
        // },
        {
          title: '状态',
          scopedSlots: { customRender: 'status_label' }
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
    openImages (item) {
      window.open(item.image_url, '_blank')
    },
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
