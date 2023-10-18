<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">

      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="会员ID">
            <a-input v-decorator="['user_id']" placeholder="请输入会员ID" />
          </a-form-item>
          <a-form-item label="订单号">
            <a-input v-decorator="['order_no']" placeholder="请输入订单号" />
          </a-form-item>
          <a-form-item label="商品名称">
            <a-input v-decorator="['goods_name']" placeholder="请输入商品名称" />
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-decorator="['status', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="1">未开始</a-select-option>
              <a-select-option :value="2">运行中</a-select-option>
              <a-select-option :value="3">停止</a-select-option>
              <a-select-option :value="4">撤单</a-select-option>
              <a-select-option :value="5">已完成</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="订单类型">
            <a-select v-decorator="['order_cate', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="1">普通订单</a-select-option>
              <a-select-option :value="2">砍价订单</a-select-option>
              <a-select-option :value="3">赠送活动</a-select-option>
              <a-select-option :value="4">打折订单</a-select-option>
              <a-select-option :value="5">众筹订单</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="购买时间">
            <a-date-picker format="YYYY-MM-DD" v-decorator="['payTime']" />
          </a-form-item>
          <a-form-item label="到期时间">
            <a-date-picker format="YYYY-MM-DD" v-decorator="['endTime']" />
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
          <span style="margin-right: 20px;">销售总金额: <span style="color: green;">{{ total_price }}</span> </span>
          <span style="margin-right: 20px;">销售总收益: <span style="color: green;">{{ total_profit }}</span> </span>
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
      :scroll="{ x: 1250 }"
    >
      <template slot="goods_img" slot-scope="item">
        <div>产品ID：<span style="color:green;">{{ item.goods_id }}</span></div>
        <div >产品名称：<span class="twoline-hide" style="color:green;">{{ item.goods_name }}</span></div>

      </template>
      <template slot="order_info" slot-scope="item">
        <div>
          <div>用户ID：<span style="color:green;">{{ item.user_id }}</span></div>
          <div>用户昵称：<span style="color:green;">{{ item.user.nick_name }}</span></div>
          <div>用户手机号：<span style="color:green;">{{ item.user.mobile }}</span></div>
          <div>所属代理：<span style="color:green;">{{ item.user.agent ? item.user.agent.nickname : '-' }}</span></div>

        </div>
      </template>
      <template slot="buy_info" slot-scope="item">
        <div>
          <div>数量：<span style="color:green;">{{ item.buy_num }}</span></div>
          <div>单价：<span style="color:green;">{{ item.price }}</span></div>
          <div>投资金额：<span style="color:green;">{{ item.total_price }}</span></div>
          <div>累计收益：<span style="color:green;">{{ item.total_profit }}</span></div>
        </div>
      </template>
      <template slot="pay_info" slot-scope="item">
        <div>
          <div>订单号：<span style="color:green;">{{ item.order_no }}</span></div>
          <div>订单类型：<span style="color:green;">{{ item.order_cate_label }}</span></div>
          <div>支付状态：<span style="color:green;">{{ item.pay_status_label }}</span></div>
          <div>支付时间：<span style="color:green;">{{ item.pay_time }}</span></div>
          <div>是否定期：<span style="color:green;">{{ item.isfix ? '是' : '否' }}</span></div>
        </div>
      </template>
      <template slot="time_info" slot-scope="item">
        <div>
          <div></div>
          <div>投资时间：<span style="color:green;">{{ item.create_time }}</span></div>
          <div>返还天数: <span style="color:green;">{{ item.order_goods.total_day }}</span></div>
        </div>
      </template>

      <div class="actions" slot="action" slot-scope="text, item">
        <a Status @click="handleStatus(item)" style="margin-right: 10px;">修改状态</a>
        <br />
        <a @click="handleEditIcome(item)" style="margin-right: 10px;">修改累计收益</a>
        <br />
        <a @click="handleCancel(item)" style="margin-right: 10px;">撤单</a>
      </div>

      <div slot="status_label" slot-scope="item">
        <a-tag v-if="item.status == 1">
          未开始
        </a-tag>
        <a-tag v-if="item.status == 2" color="green">
          运行中
        </a-tag>
        <a-tag v-if="item.status == 3" color="red">
          停止
        </a-tag>
        <a-tag v-if="item.status == 4" color="cyan">
          撤单
        </a-tag>
        <a-tag v-if="item.status == 5" color="purple">
          已完成
        </a-tag>
      </div>

    </s-table>

    <a-modal
        v-model="editVisible"
        title="修改累计收益"
        ok-text="确认"
        cancel-text="取消"
        @cancel="editModal"
        @ok="editOkModal">
      <div style="text-align: center">
        <a-input-number :min="0" v-model="liveItem_total"  placeholder="修改" />
      </div>
    </a-modal>

    <a-modal
      v-model="cancelVisible"
      title="修改订单状态"
      ok-text="确认"
      cancel-text="取消"
      @cancel="cancelModal"
      @ok="okModal">
      <div style="text-align: center">
        <a-radio-group button-style="solid" :value="status" @change="onChange">
          <a-radio-button disabled :value="1">
            未开始
          </a-radio-button>
          <a-radio-button :value="2">
            运行中
          </a-radio-button>
          <a-radio-button :value="3">
            停止
          </a-radio-button>
          <a-radio-button disabled :value="4">
            撤单
          </a-radio-button>
          <a-radio-button :value="5">
            完成
          </a-radio-button>
        </a-radio-group>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import * as Api from '@/api/neworder'
import { STable } from '@/components'
import moment from 'moment'

export default {
  name: 'Index',
  components: {
    STable
  },
  data () {
    return {
      total_price: 0,
      total_profit: 0,
      liveItem: {
        status: 0
      },
      liveItem_total: '',
      status: '',
      cancelVisible: false,
      editVisible: false,
      // 正在加载
      isLoading: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '订单ID',
          width: '80px',
          dataIndex: 'order_id'
        },
        {
          title: '项目名称',
          width: '170px',
          scopedSlots: { customRender: 'goods_img' }
        },
        {
          title: '用户信息',
          width: '170px',
          scopedSlots: { customRender: 'order_info' }
        },

        // {
        //   title: '会员ID',
        //   dataIndex: 'user_id'
        // },
        {
          title: '投资信息',
          width: '170px',
          scopedSlots: { customRender: 'buy_info' }
        },
        {
          title: '支付信息',
          width: '210px',
          scopedSlots: { customRender: 'pay_info' }
        },
        {
          title: '时间信息',
          width: '210px',
          scopedSlots: { customRender: 'time_info' }
        },
        {
          title: '当前状态',
          scopedSlots: { customRender: 'status_label' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          width: 130,
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
    this.getTotal()
  },
  methods: {
    getTotal () {
      Api.total()
        .then((result) => {
          this.total_price = result.data.total_price
          this.total_profit = result.data.total_profit
        })
    },
    handleEditIcome(item) {
      this.liveItem = item
      this.liveItem_total = item.total_profit
      this.editVisible = true
    },
    openImages (item) {
      window.open(item.order_goods.goods_image, '_blank')
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
    onChange (el) {
      this.status = el.target.value
    },
    cancelModal () {
      this.status = ''
    },
    editModal () {
      this.status = ''
    },
    editOkModal() {
      const app = this
      const modal = this.$confirm({
        title: '您确认要修改该订单累计吗?',
        content: '请谨慎操作',
        onOk () {
          const { order_id } = app.liveItem
          return Api.changeTotalProfit({ order_id, form: { total_profit: app.liveItem_total } })
              .then((result) => {
                app.$message.success(result.message, 1.5)
                // 重置弹窗
                app.editVisible = false
                app.status = ''
                app.handleRefresh()
                app.getTotal()
              })
              .finally(result => {
                modal.destroy()
              })
        }
      })
    },
    okModal () {
      const app = this
      const modal = this.$confirm({
        title: '您确认要修改订单吗?',
        content: '请谨慎操作',
        onOk () {
          const { order_id } = app.liveItem
          return Api.switchStatus({ order_id, form: { status: app.status } })
            .then((result) => {
              app.$message.success(result.message, 1.5)
              // 重置弹窗
              app.cancelVisible = false
              app.status = ''
              app.handleRefresh()
              app.getTotal()
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

    handleCancel (item) {
      const app = this
      app.$confirm({
        title: '您确定撤除该订单了吗?',
        content: '确认后将无法恢复',
        onOk () {
          Api.cancel({ order_id: item.order_id }).then(res => {
            app.$message.success('撤单成功')
            app.handleRefresh(true)
          }).catch(err => {
            app.$message.error(err.message)
          })
          // 确认删除
          // return app.onSubmitDelete(item)
        }
      })
    },

    /**
     * 删除记录
     */
    handleStatus (item) {
      this.liveItem = item
      this.liveItem.status = item.status
      this.cancelVisible = true
      // const app = this
      // app.$confirm({
      //   title: '您确定撤除该订单了吗?',
      //   content: '确认后将无法恢复',
      //   onOk () {
      //     Api.cancel().then(res => {
      //       app.$message.success('撤单成功')
      //       app.handleRefresh(true)
      //     }).catch(err => {
      //       app.$message.error(err.message)
      //     })
      //     // 确认删除
      //     // return app.onSubmitDelete(item)
      //   }
      // })
    },

    // 确认搜索
    handleSearch (e) {
      e.preventDefault()
      this.searchForm.validateFields((error, values) => {
        // endTime: moment(values.endTime).format('YYYY-MM-DD')

        if (!error) {

          if (values.payTime) {
            values.payTime = [moment(values.payTime).format('YYYY-MM-DD')]
          }
          if (values.endTime) {
            values.endTime = [moment(values.endTime).format('YYYY-MM-DD')]
          }

          this.queryParam = { ...this.queryParam,...values }
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
