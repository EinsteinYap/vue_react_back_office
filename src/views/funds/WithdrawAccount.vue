<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="会员ID">
            <a-input v-decorator="['user_id']" placeholder="会员ID" />
          </a-form-item>
          <a-form-item label="收款人姓名">
            <a-input v-decorator="['search']" placeholder="请输入收款人姓名" />
          </a-form-item>
          <a-form-item label="联系方式">
            <a-input v-decorator="['conact_way']" placeholder="请输入联系方式" />
          </a-form-item>
          <a-form-item label="ifsc">
            <a-input v-decorator="['ifsc']" placeholder="请输入ifsc" />
          </a-form-item>
          <a-form-item label="银行卡号">
            <a-input v-decorator="['bank_card_number']" placeholder="请输入银行卡号" />
          </a-form-item>
          <a-form-item label="USDT地址">
            <a-input v-decorator="['address']" placeholder="请输入USDT地址" />
          </a-form-item>
          <a-form-item label="类型">
            <a-select v-decorator="['cateid', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="1">USDT</a-select-option>
              <a-select-option :value="2">银行卡</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-decorator="['scene', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="0">删除</a-select-option>
              <a-select-option :value="1">使用中</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="search-btn">
            <a-button type="primary" icon="search" html-type="submit">搜索</a-button>
          </a-form-item>
          <a-form-item class="search-btn">
            <a-button type="primary" @click="handleAdd()" >新增用户收款</a-button>
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
      <div slot="bank_card_number" slot-scope="item">
<!--        address_cateid-->
        <div v-if="item.cateid === 2">银行卡: {{ item.bank_card_number}}</div>
        <div v-if="item.cateid === 1">USDT: {{ item.address }}</div>
        <div v-if="item.cateid === 1">地址类型: {{ item.address_cateid == 1 ? 'TRC20' : 'ETH' }}</div>
      </div>
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
      <div class="actions" slot="action" slot-scope="text, item">
        <a @click="handleDelete(item)">删除</a>
      </div>
    </s-table>
    <Shoukuan ref="Shoukuan" @handleSubmit="handleRefresh"></Shoukuan>
  </a-card>

</template>

<script>
import * as Api from '@/api/capital/payment'
import { STable } from '@/components'
import Shoukuan from './Shoukuan'

export default {
  name: 'Index',
  components: {
    STable,
    Shoukuan
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
          dataIndex: 'id'
        },
        {
          title: '会员编号',
          dataIndex: 'user_id'
        },
        {
          title: '用户昵称',
          dataIndex: 'user.nick_name'
        },
        {
          title: '类型',
          dataIndex: 'cate_label'
        },
        {
          title: '手机号',
          dataIndex: 'mobile'
        },
        {
          title: '地址相关',
          scopedSlots: { customRender: 'bank_card_number' }
        },
        {
          title: 'ifsc',
          dataIndex: 'ifsc'
        },
        {
          title: '收款人姓名',
          dataIndex: 'user_name'
        },
        {
          title: '联系方式',
          dataIndex: 'conact_way'
        },
        {
          title: '类型',
          dataIndex: 'cate_label'
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
    // loadTotalData () {
    //   Api.scene()
    //     .then(response => {
    //       // console.log(response)
    //       this.sceneData = response.data
    //     })
    // },
    // okModal() {
    //   const app = this
    //   const modal = this.$confirm({
    //     title: '你确定手动通过这笔充值订单吗?',
    //     content: '通过后不可撤回',
    //     onOk () {
    //       return Api.apply({ order_id: app.currentItem.order_id, form: { reason: app.reason } })
    //         .then(result => {
    //           app.$message.success(result.message, 1.5)
    //           app.currentItem = {}
    //           app.reason = ''
    //           app.applyVisible = false
    //           app.handleRefresh()
    //         })
    //         .finally(result => {
    //           modal.destroy()
    //         })
    //     }
    //   })
    // },

    handleAdd () {
      this.$refs.Shoukuan.handle()
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
      // this.loadTotalData()
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
