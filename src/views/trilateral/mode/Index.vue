<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <!--        <a-col :span="2">-->
        <!--          <a-button  type="primary" icon="plus" @click="handleAdd">新增</a-button>-->
        <!--        </a-col>-->
        <!--        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">-->
        <!--          <a-form-item label="关键词">-->
        <!--            <a-input v-decorator="['keyword']" placeholder="请输入关键词" />-->
        <!--          </a-form-item>-->
        <!--          <a-form-item label="状态">-->
        <!--            <a-select v-decorator="['status', { initialValue: -1 }]">-->
        <!--              <a-select-option :value="-1">全部</a-select-option>-->
        <!--              <a-select-option :value="item.id" v-for="item in languageList" :key="item.id">-->
        <!--                {{ item.cname }}-->
        <!--              </a-select-option>-->
        <!--            </a-select>-->
        <!--          </a-form-item>-->

        <!--          <a-form-item class="search-btn">-->
        <!--            <a-button type="primary" icon="search" html-type="submit">搜索</a-button>-->
        <!--          </a-form-item>-->
        <!--        </a-form>-->
      </a-row>
    </div>
    <s-table
      ref="table"
      rowKey="language_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :showPagination="false"
      :scroll="{ x: 1450 }"
    >
      <div slot="ids" slot-scope="item">
        <div>编号ID:<span style="color: red;">{{ item.id }}</span></div>
        <div>支付名称:<span style="color: red;">{{ item.pay_name }}</span></div>
        <div>支付代号:<span style="color: red;">{{ item.pay_code }}</span></div>
      </div>
      <div slot="free" slot-scope="item">
        <div>提现手续费:<span style="color: red;">{{ item.withdraw_fee }}</span></div>
        <div>充值手续费:<span style="color: red;">{{ item.recharge_fee }}</span></div>
      </div>
      <div slot="total_free" slot-scope="item">
        <div>充值费用:<span style="color: red;">{{ item.recharge.money }}</span></div>
        <div>充值手续费:<span style="color: red;">{{ item.recharge.service_charge }}</span></div>
        <div>提现费用:<span style="color: red;">{{ item.withdraw.money ? item.withdraw.money : '-' }}</span></div>
        <div>提现手续费:<span style="color: red;">{{ item.withdraw.service_charge ? item.withdraw.service_charge : '-' }}</span></div>
      </div>
      <div slot="category" slot-scope="item">
        <div v-if="item.category">类型ID:<span style="color: red;">{{ item.category.id }}</span></div>
        <div v-if="item.category">类型名称:<span style="color: red;">{{ item.category.cname }}</span></div>
        <div v-if="item.category">币种ID:<span style="color: red;">{{ item.currency.id }}</span></div>
        <div v-if="item.category">币种名称:<span style="color: red;">{{ item.currency.cname }}</span></div>
      </div>
      <div slot="amount" slot-scope="item ">
        <div>最小充值:<span style="color: red;">{{ item.min_recharge }}</span></div>
        <div>最大充值:<span style="color: red;">{{ item.max_recharge }}</span></div>
        <div>最小提现:<span style="color: red;">{{ item.min_withdraw }}</span></div>
      </div>
      <div slot="rechargeExchange" slot-scope="item">
        <div v-if="item">汇率ID:<span style="color: red;">{{ item.id }}</span></div>
        <div v-if="item">国家:<span style="color: red;">{{ item.country }}</span></div>
        <div v-if="item">币种:<span style="color: red;">{{ item.currency }}</span></div>
        <div v-if="item">汇率:<span style="color: red;">{{ item.rate }}</span></div>
      </div>
      <div slot="withdrawExchange" slot-scope="item ">
        <div v-if="item">汇率ID:<span style="color: red;">{{ item.id }}</span></div>
        <div v-if="item">国家:<span style="color: red;">{{ item.country }}</span></div>
        <div v-if="item">币种:<span style="color: red;">{{ item.currency }}</span></div>
        <div v-if="item">汇率:<span style="color: red;">{{ item.rate }}</span></div>
      </div>
      <div style="text-align: center" slot="status_time" slot-scope="item">
        <a-tag color="green" v-if="item.status == 1">正常</a-tag>
        <a-tag color="red" v-if="item.status == 0">关闭</a-tag>
<!--        <div><span style="color: red;">{{ item.status_label }}</span></div>-->
<!--        <div><span style="color: red;">{{ item.create_time }}</span></div>-->
      </div>
      <span slot="payconfig" slot-scope="item">

      </span>
      <span slot="action" slot-scope="text, item">
        <a @click="handlePay(item)">查看配置</a>
        <br />
        <a  @click="handleEdit(item)" style="margin-right: 10px">编辑</a>
        <a  v-if="!item.id" @click="handleEdit(item)">安装</a>
        <a  v-if="item.id" @click="handleDelete(item)">卸载</a>
      </span>
    </s-table>
    <a-modal
      v-model="applyVisible"
      title="查看支付配置"
      ok-text="确认"
      cancel-text="取消"
      @cancel="applyVisible = false"
      @ok="okModal">
      <div style="text-align: center;margin: 10px;">
        <a-card :title="currentItem.pay_name" size="small">
          <a-card-grid style="width: 100%; text-align: left" v-for="(item, index) in currentItem.pay_config" :key="index">
            <div>名称: <span style="color: red;">{{ item.name }}</span></div>
            <div>Key: <span style="color: red;">{{ item.name }}</span></div>
            <div>值: <span style="color: red;">{{ item.value }}</span></div>
          </a-card-grid>
        </a-card>
      </div>
    </a-modal>

    <EditForm ref="EditForm" @handleSubmit="handleRefresh" />

  </a-card>
</template>

<script>
import * as Api from '@/api/payment/mode'
import { STable } from '@/components'
import AddForm from './modules/AddForm'
import EditForm from './modules/EditForm'
import * as LanguageApi from '@/api/globalization/language'

export default {
  name: 'Index',
  components: {
    STable,
    AddForm,
    EditForm
  },
  data () {
    return {
      applyVisible: false,
      currentItem: {},
      // 正在加载
      isLoading: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '编号ID',
          scopedSlots: { customRender: 'ids' }
        },
        {
          title: '费用',
          scopedSlots: { customRender: 'free' }
        },
        {
          title: '金额',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '充值',
          dataIndex: 'rechargeExchange',
          scopedSlots: { customRender: 'rechargeExchange' }
        },
        {
          title: '提现',
          dataIndex: 'withdrawExchange',
          scopedSlots: { customRender: 'withdrawExchange' }
        },
        {
          title: '描述',
          dataIndex: 'pay_desc'
        },
        {
          title: '类型',
          scopedSlots: { customRender: 'category' }
        },
        {
          title: '总额',
          scopedSlots: { customRender: 'total_free' }
        },
        // {
        //   title: '支付配置',
        //   scopedSlots: { customRender: 'payconfig' }
        // },
        {
          title: '状态',
          scopedSlots: { customRender: 'status_time' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          width: 120,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.list({ ...param, ...this.queryParam })
          .then(response => {
            console.log(response)
            const newResponse = {
              data: {
                list: {
                  current_page: 1,
                  data: response.data.list,
                  last_page: 1,
                  per_page: 100000,
                  total: 100000
                }
              }
            }
            return newResponse.data.list
          })
      },
      // 当前表单元素
      searchForm: this.$form.createForm(this)
    }
  },
  created () {
  },
  methods: {
    okModal () {
      const app = this
      const modal = this.$confirm({
        title: '你确定手动通过这笔充值订单吗?',
        content: '通过后不可撤回',
        onOk () {
          app.currentItem = {}
          app.applyVisible = false
          // return Api.apply({ order_id: app.currentItem.order_id, form: { reason: app.reason } })
          //   .then(result => {
          //     app.$message.success(result.message, 1.5)
          //     app.currentItem = {}
          //     app.reason = ''
          //     app.applyVisible = false
          //     app.handleRefresh()
          //   })
          //   .finally(result => {
          //     modal.destroy()
          //   })
        }
      })
    },
    /**
     * 查看配置
     */
    handlePay (item) {
      this.currentItem = item
      this.applyVisible = true
    },

    /**
     * 新增记录
     */
    handleAdd (item) {
      this.$refs.AddForm.add(item)
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
          const newValues = {
            ...values,
            balance: [values.start_balance, values.end_balance],
            red_paper: [values.start_red_paper, values.end_red_paper]
          }
          //
          if (!newValues.balance[0]) {
            delete newValues.balance
          }
          if (!newValues.red_paper[0]) {
            delete newValues.red_paper
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
