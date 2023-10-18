<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="会员ID">
            <a-input v-decorator="['user_id']" placeholder="会员ID" />
          </a-form-item>
          <a-form-item label="用户昵称">
            <a-input v-decorator="['search']" placeholder="请输入用户昵称" />
          </a-form-item>
          <a-form-item label="所属代理ID">
            <a-input v-decorator="['agent_id']" placeholder="请输入所属代理ID" />
          </a-form-item>
          <a-form-item label="奖励类型">
            <a-select v-decorator="['scene', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="item.value" v-for="item in sceneData" :key="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="订单编号">
            <a-input v-decorator="['order_no']" placeholder="请输入订单编号" />
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
      rowKey="language_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
      <!--      用户-->
      <div slot="user" slot-scope="item">
        <div>会员ID: <span style="color: red">{{ item.user_id }}</span></div>
        <div>用户名: <span style="color: red">{{ item.user.nick_name }}</span></div>
      </div>
      <!-- 订单号 -->
      <div slot="order" slot-scope="item">
        <div>订单号: <span style="color: red">{{ item.order_no }}</span></div>
        <div>充值时间: <span style="color: red">{{ item.create_time }}</span> </div>
        <div>充值金额: <span style="color: red">{{ item.pay_price }}</span></div>
      </div>
      <!-- 状态 -->
      <span slot="status" slot-scope="text">
        <a-tag v-if="text == 10" color="blue">待支付</a-tag>
        <a-tag v-if="text == 20" color="green">已支付</a-tag>
        <a-tag v-if="text == 30" color="red">失败</a-tag>
      </span>
    </s-table>
  </a-card>

</template>

<script>
import * as Api from '@/api/capital/commission'
import { STable } from '@/components'

export default {
  name: 'Index',
  components: {
    STable
  },
  data () {
    return {
      applyVisible: false,
      currentItem: {},
      reason: '',
      // 正在加载
      isLoading: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'log_id'
        },
        {
          title: '会员ID',
          dataIndex: 'user_id'
        },
        {
          title: '用户昵称',
          dataIndex: 'user.nick_name'
        },
        {
          title: '所属代理',
          dataIndex: 'user.agent.user_name'
        },
        {
          title: '奖励类型',
          dataIndex: 'scene_label'
        },
        {
          title: '奖励金额',
          dataIndex: 'money'
        },
        {
          title: '当前余额',
          dataIndex: 'now_money'
        },
        {
          title: '订单编号',
          dataIndex: 'order_no'
        },
        // {
        //   title: '订单金额'
        // },
        {
          title: '描述',
          dataIndex: 'describe'
        },
        {
          title: '创建时间',
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
      sceneData: [],
      // 当前表单元素
      searchForm: this.$form.createForm(this)
    }
  },
  created () {
    this.loadTotalData()
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
    loadTotalData () {
      Api.scene()
        .then(response => {
          // console.log(response)
          this.sceneData = response.data
        })
    },
    handleApply (item) {
      this.currentItem = item
      this.applyVisible = true
    },
    /**
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh (bool = false) {
      this.$refs.table.refresh(bool)
      this.loadTotalData()
    },

    // 确认搜索
    handleSearch (e) {
      e.preventDefault()
      this.searchForm.validateFields((error, values) => {
        if (!error) {
          console.log(values)
          this.queryParam = { ...this.queryParam, ...values }
          this.handleRefresh(true)
          // this.loadTotalData()
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

.total-wrapper {
  display: flex;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 10px;
  justify-content: flex-start;
  > div {
    margin-left: 10px;
    margin-right: 10px;
  }
}

</style>
