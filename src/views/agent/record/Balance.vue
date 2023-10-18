<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="代理商昵称">
            <a-input v-decorator="['nickname']" placeholder="请输入代理商昵称" />
          </a-form-item>
          <a-form-item label="订单号">
            <a-input v-decorator="['order_no']" placeholder="请输入订单号" />
          </a-form-item>
          <a-form-item label="充值时间">
            <a-range-picker format="YYYY-MM-DD" v-decorator="['betweenTime']" />
          </a-form-item>
          <a-form-item label="类型">
            <a-select v-decorator="['mode', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option value="inc">增加</a-select-option>
              <a-select-option value="dec">减少</a-select-option>
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
      <!-- 状态 -->
      <span slot="status" slot-scope="text">
        <a-tag :color="text ? 'green' : 'red'">{{ text ? '正常' : '冻结' }}</a-tag>
      </span>

      <div slot="agent" slot-scope="item">
        <div>代理商ID: <span style="color:red;">{{ item.agent.id }}</span></div>
        <div>代理商用户名: <span style="color:red;">{{ item.agent.user_name }}</span></div>
        <div>代理商昵称: <span style="color:red;">{{ item.agent.nickname }}</span></div>
      </div>

      <div slot="op" slot-scope="item">
        <div v-if="item.operator">
          <span>{{ item.operator }}</span>
<!--          <div>操作员ID: <span style="color:red;">{{ item.store_user.store_user_id }}</span></div>-->
<!--          <div>操作员用户名: <span style="color:red;">{{ item.store_user.user_name }}</span></div>-->
<!--          <div>操作员昵称: <span style="color:red;">{{ item.store_user.nickname }}</span></div>-->
        </div>
        <div v-else> - </div>
      </div>

    </s-table>
  </a-card>
</template>

<script>
import * as Api from '@/api/agent/balance'
import { STable } from '@/components'

export default {
  name: 'Index',
  components: {
    STable
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
          dataIndex: 'log_id'
        },
        {
          title: '代理商',
          scopedSlots: { customRender: 'agent' }
        },
        {
          title: '操作员',
          scopedSlots: { customRender: 'op' }
        },
        {
          title: '订单号',
          dataIndex: 'order_no'
        },
        {
          title: '场景值',
          dataIndex: 'scene_label'
        },
        {
          title: '类型值',
          dataIndex: 'cate_label'
        },
        {
          title: '变动金额',
          dataIndex: 'money'
        },
        {
          title: '账变后金额',
          dataIndex: 'now_money'
        },
        {
          title: '描述',
          dataIndex: 'describe'
        },
        {
          title: '充值时间',
          dataIndex: 'create_time'
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
