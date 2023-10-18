<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="申请状态">
            <a-select v-decorator="['apply_status', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="0">待审核</a-select-option>
              <a-select-option :value="1">支付中</a-select-option>
              <a-select-option :value="2">已完成</a-select-option>
              <a-select-option :value="3">已退回</a-select-option>
              <a-select-option :value="4">失败</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="会员ID">
            <a-input v-decorator="['user_id']" placeholder="会员ID" />
          </a-form-item>
          <a-form-item label="所属代理ID">
            <a-input v-decorator="['agent_id']" placeholder="请输入所属代理ID" />
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
    <a-alert banner>
      <template slot="message">
        <div>
          <span style="margin-right: 20px;">待审核金额: <span style="color: red">{{ totalData['0'] }}</span></span>
          <span>累计提现金额: <span style="color: red">{{ totalData['2'] }}</span></span>
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
      <div slot="order_info" slot-scope="item">
        <div>{{ item.order_no ? item.order_no : '-' }}</div>
      </div>
      <!--      用户-->
      <div slot="user" slot-scope="item">
        <div>会员编号: <span style="color: red">{{ item.user_id }}</span></div>
        <div>用户名: <span style="color: red">{{ item.user.nick_name }}</span></div>
      </div>
      <div slot="pay_info" slot-scope="item">
        <div>支付名称: <span style="color: red">{{ item.pay_name ? item.pay_name : '-' }}</span></div>
        <div>支付渠道: <span style="color: red">{{ item.pay_channel ? item.pay_channel : '-' }}</span></div>
        <div>提现时间: <span style="color: red">{{ item.create_time }}</span></div>
      </div>
      <!-- 订单号 -->
      <div slot="order" slot-scope="item">
        <div>提现金额: <span style="color: red">{{ item.money }}</span></div>
        <div>提现手续费: <span style="color: red">{{ item.service_fee }}</span> </div>
        <div>渠道手续费: <span style="color: red">{{ item.service_charge }}</span> </div>
        <div>USDT数量: <span style="color: red">{{ item.usdt_num }}</span></div>
        <div>转换率: <span style="color: red">{{ item.conver_rate }}%</span></div>
        <div>实付金额: <span style="color: red">{{ item.real_money }}</span></div>
        <div>实际到账金额: <span style="color: red">{{ item.actual_money }}</span></div>
      </div>
      <!-- 状态 -->
      <span slot="statusLabel" slot-scope="item">
        <a-tag v-if="item.apply_status == 0" >待审核</a-tag>
        <a-tag v-if="item.apply_status == 1" color="blue">支付中</a-tag>
        <a-tag v-if="item.apply_status == 2" color="green">已完成</a-tag>
        <a-tag v-if="item.apply_status == 3" color="blue">已退回</a-tag>
        <a-tag v-if="item.apply_status == 4" color="red">失败</a-tag>
      </span>
      <div class="actions" slot="action" slot-scope="text, item">
        <a v-if="item.apply_status == 0" @click="handleApply(item)">手动审核</a>
        <span v-else>已操作</span>
      </div>
    </s-table>

    <a-modal v-model="applyVisible" title="审核提现订单" ok-text="确认" cancel-text="取消" @ok="okModal">
      <a-form :form="Shform">
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['apply_status', {initialValue: 1, rules: [{required: true}]}]">
            <a-radio :value="1">支付中</a-radio>
            <a-radio :value="3">已退回</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="三方支付通道ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['payment_id', { rules: [{required: true, message: '请选择三方支付通道ID'}] }]">
            <a-select-option :value="item.id" v-for="item in paymentList" :key="item.id">
              {{ item.pay_name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="拒绝原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea v-decorator="['reject_reason']" placeholder="请输入拒绝原因" :autoSize="{ minRows: 4, maxRows: 6 }" />
        </a-form-item>

      </a-form>
    </a-modal>
  </a-card>

</template>

<script>
import * as Api from '@/api/user/withdraw'
import * as WApi from '@/api/payment/mode'
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
      // 标签布局属性
      labelCol: {
        span: 7
      },
      // 输入框布局属性
      wrapperCol: {
        span: 13
      },
      // 正在加载
      isLoading: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '申请ID',
          dataIndex: 'id'
        },
        {
          title: '所属代理',
          dataIndex: 'user.agent.user_name'
        },
        {
          title: '订单号',
          scopedSlots: { customRender: 'order_info' }
        },
        {
          title: '用户信息',
          scopedSlots: { customRender: 'user' }
        },
        {
          title: '金额相关',
          scopedSlots: { customRender: 'order' }
        },
        {
          title: '支付/时间',
          // dataIndex: 'pay_name',
          scopedSlots: { customRender: 'pay_info' }
        },
        // {
        //   title: '支付渠道',
        //   dataIndex: 'pay_channel'
        // },
        // {
        //   title: '提现时间',
        //   dataIndex: 'create_time'
        // },
        {
          title: '状态',
          scopedSlots: { customRender: 'statusLabel' }
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
      totalData: {},
      // 当前表单元素
      searchForm: this.$form.createForm(this),
      Shform: this.$form.createForm(this),
      paymentList: [],
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
      WApi.withdrawList()
        .then(response => {
          this.paymentList = response.data
        })
      Api.total()
        .then(response => {
          console.log(response)
          this.totalData = response.data
        })
    },
    okModal () {
      const app = this
      const modal = this.$confirm({
        title: '你确定手动拒绝这笔提现订单吗?',
        content: '审核后不可撤回',
        onOk () {
          app.Shform.validateFields((error, values) => {
            if (!error) {
              return Api.audit({ id: app.currentItem.id, form: { ...values } })
                .then(result => {
                  app.$message.success(result.message, 1.5)
                  app.currentItem = {}
                  app.applyVisible = false
                  app.Shform.resetFields()
                  app.handleRefresh()
                })
                .finally(result => {
                  modal.destroy()
                })
              this.handleRefresh(true)
              // this.loadTotalData()
            }
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
