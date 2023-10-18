<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="订单号">
            <a-input v-decorator="['order_no']" placeholder="请输入订单号" />
          </a-form-item>
          <a-form-item label="用户ID">
            <a-input v-decorator="['user_id']" placeholder="请输入用户ID" />
          </a-form-item>
          <a-form-item label="用户昵称">
            <a-input v-decorator="['search']" placeholder="请输入用户昵称" />
          </a-form-item>
          <a-form-item label="充值金额范围">
            <a-input-number :min="0" v-decorator="['pay_price[0]']" placeholder="请输入金额" />
            <span> - </span>
            <a-input-number :min="0" v-decorator="['pay_price[1]']" placeholder="请输入金额" />
          </a-form-item>
          <a-form-item label="支付渠道">
            <a-select v-decorator="['payment_id', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="item.id" v-for="item in payAllList" :key="item.id">
                {{ item.pay_name }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="时间范围">
            <a-range-picker format="YYYY-MM-DD" v-decorator="['betweenTime']" />
          </a-form-item>
<!--          <a-form-item label="支付状态">-->
<!--            <a-select v-decorator="['pay_status', { initialValue: -1 }]">-->
<!--              <a-select-option :value="-1">全部</a-select-option>-->
<!--              <a-select-option :value="10">待支付</a-select-option>-->
<!--              <a-select-option :value="20">已支付</a-select-option>-->
<!--              <a-select-option :value="30">失败</a-select-option>-->
<!--            </a-select>-->
<!--          </a-form-item>-->
          <a-form-item class="search-btn">
            <a-button type="primary" icon="search" html-type="submit">搜索</a-button>
          </a-form-item>
        </a-form>
      </a-row>
    </div>
    <a-alert banner>
      <template slot="message">
        <div>
<!--          <span style="margin-right: 20px;">累计充值完成金额: <span style="color: red">{{ totalData.success }}</span> </span>-->
          <span style="margin-right: 20px;">已失败金额: <span style="color: red">{{ totalData.fiail }}</span> </span>
<!--          <span>累计未到账金额: <span style="color: red">{{ totalData.padding }}</span> </span>-->
        </div>
      </template>
    </a-alert>
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
        <div>所属代理: <span style="color: red">{{ item.user.agent.nickname }}</span></div>
        <div>用户ID: <span style="color: red">{{ item.user_id }}</span></div>
        <div>用户名: <span style="color: red">{{ item.user.nick_name }}</span></div>
      </div>
      <div slot="conver_info" slot-scope="item">
        <div>转换率: <span style="color: red">{{ item.conver_rate }}%</span></div>
        <div>实际到账: <span style="color: red">{{ item.actual_money }}</span> </div>
      </div>
      <div slot="pay_info" slot-scope="item">
        <div>支付名称: <span style="color: red">{{ item.pay_name }}</span></div>
        <div>支付渠道: <span style="color: red">{{ item.pay_channel }}</span> </div>
      </div>
      <!-- 订单号 -->
      <div slot="order" slot-scope="item">
        <div>订单号: <span style="color: red">{{ item.order_no }}</span></div>
        <div>充值时间: <span style="color: red">{{ item.create_time }}</span> </div>
        <div>{{ item.pay_cateid === 2 ? '兑换金额' : '充值金额' }}: <span style="color: red">{{ item.pay_price }}</span></div>
        <div v-if="item.pay_cateid == 2 ">USDT数量: <span style="color: red">{{ item.usdt_num }}</span></div>
        <div>充值类型: <span style="color: red">{{ item.pay_cate_label }}</span></div>
      </div>
      <!-- 状态 -->
      <span slot="status" slot-scope="text">
        <a-tag v-if="text == 10" color="blue">待支付</a-tag>
        <a-tag v-if="text == 20" color="green">已支付</a-tag>
        <a-tag v-if="text == 30" color="red">失败</a-tag>
      </span>
      <div class="actions" slot="action" slot-scope="text, item">
        <a v-if="item.pay_status == 10" @click="handleApply(item)">手动通过</a>
        <span v-else>已操作</span>
      </div>
    </s-table>
    <a-modal v-model="applyVisible" title="审核充值订单" ok-text="确认" cancel-text="取消" @ok="okModal">
      <div style="text-align: center;margin: 10px;">
        <a-textarea v-model="reason" placeholder="请输入审核原因" :autoSize="{ minRows: 4, maxRows: 6 }" />
        <!--        <a-range-picker format="YYYY-MM-DD" v-model="betweenTime" />-->
      </div>
    </a-modal>
  </a-card>

</template>

<script>
import * as Api from '@/api/capital/recharge'
import * as PayApi from '@/api/payment/mode'
import { STable } from '@/components'
import * as ArticleApi from '@/api/content/article'

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
      queryParam: {
        pay_status: 30
      },
      payAllList: [],
      // 表头
      columns: [
        {
          title: '订单ID',
          dataIndex: 'order_id'
        },
        {
          title: '用户信息',
          scopedSlots: { customRender: 'user' }
        },
        {
          title: '订单号/相关时间',
          scopedSlots: { customRender: 'order' }
        },
        {
          title: '支付信息',
          scopedSlots: { customRender: 'pay_info' }
        },

        {
          title: '转换率/实际到账',
          // dataIndex: 'conver_rate',
          scopedSlots: { customRender: 'conver_info' }
        },
        {
          title: '支付状态',
          dataIndex: 'pay_status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'action',
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
      totalData: {},
      // 当前表单元素
      searchForm: this.$form.createForm(this)
    }
  },
  created () {
    this.loadTotalData()
    this.getPayAlllist()
  },
  methods: {
    getPayAlllist() {
      PayApi.allList()
      .then(response => {
        this.payAllList = response.data
      })
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
    loadTotalData () {
      Api.total({ ...this.queryParam })
      .then(response => {
        const newTotal = {}
        response.data.forEach(e => {
          if (e.value == 10) {
            newTotal.padding = e.money ? e.money : 0
          }
          if (e.value == 20) {
            newTotal.success = e.money ? e.money : 0
          }
          if (e.value == 30) {
            newTotal.fiail = e.money ? e.money : 0
          }
        })
        // return newTotal
        this.totalData = newTotal
      })
    },
    okModal () {
      const app = this
      console.log('app.currentItem', app.currentItem)
      const modal = this.$confirm({
        title: '你确定手动通过这笔充值订单吗?',
        content: '通过后不可撤回',
        onOk () {
          return Api.apply({ order_id: app.currentItem.order_id, form: { reason: app.reason } })
            .then(result => {
              app.$message.success(result.message, 1.5)
              app.currentItem = {}
              app.reason = ''
              app.applyVisible = false
              app.handleRefresh()
            })
            .finally(result => {
              modal.destroy()
            })
        }
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
          const _payPrice = [];
          values.pay_price.forEach(e => {
            if (!e) {
              _payPrice.push('')
            } else {
              _payPrice.push(e)
            }
          })
          values.pay_price = _payPrice
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
