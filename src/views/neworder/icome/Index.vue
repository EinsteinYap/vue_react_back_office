<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="订单号">
            <a-input v-decorator="['order_no']" placeholder="请输入订单号" />
          </a-form-item>
          <a-form-item label="类型">
            <a-select v-decorator="['isfix', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="0">每天返回</a-select-option>
              <a-select-option :value="1">定期</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="手机号码">
            <a-input v-decorator="['mobile']" placeholder="请输入手机号码" />
          </a-form-item>
          <a-form-item label="用户ID">
            <a-input v-decorator="['user_id']" placeholder="请输入用户ID" />
          </a-form-item>
          <a-form-item label="时间范围">
            <a-range-picker format="YYYY-MM-DD" v-decorator="['betweenTime']" />
          </a-form-item>
          <!--          <a-form-item label="充值金额范围">-->
          <!--            <a-input-number v-decorator="['moneyRangeStart']" placeholder="请输入金额" />-->
          <!--            <span> - </span>-->
          <!--            <a-input-number v-decorator="['moneyRangeEnd']" placeholder="请输入金额" />-->
          <!--          </a-form-item>-->
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
      <template slot="order_info" slot-scope="item">
        <div v-if="item.order_info">
          <div>订单ID：<span style="color:red;">{{ item.order_info.order_id }}</span></div>
          <div>产品名称：<span style="color:red;">{{ item.order_info.goods_name }}</span></div>
          <div>订单号：<span style="color:red;">{{ item.order_info.order_no }}</span></div>
        </div>
        <div v-else> - </div>
      </template>
      <template slot="user_info" slot-scope="item">
        <div v-if="item.user">
          <div>用户ID：<span style="color:red;">{{ item.user.user_id }}</span></div>
          <div>手机号：<span style="color:red;">{{ item.user.mobile }}</span></div>
        </div>
        <div v-else> - </div>
      </template>
      <template slot="scene" slot-scope="text">
        <div>{{ text === 1 ? '定期' : '每天返回' }}</div>
      </template>

    </s-table>
  </a-card>
</template>

<script>
import * as Api from '@/api/neworder/icome'
import { STable } from '@/components'

export default {
  name: 'Index',
  components: {
    STable
  },
  data () {
    return {
      liveItem: {
        status: 0
      },
      status: '',
      cancelVisible: false,
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
          title: '用户信息',
          scopedSlots: { customRender: 'user_info' }
        },
        {
          title: '订单信息',
          dataIndex: 'order_no'
          // scopedSlots: { customRender: 'order_info' }
        },
        {
          title: '类型',
          dataIndex: 'scene',
          scopedSlots: { customRender: 'scene' }
        },
        {
          title: '描述',
          dataIndex: 'describe'
        },
        {
          title: '收益金额',
          dataIndex: 'money'
        },
        {
          title: '现有余额',
          dataIndex: 'now_money'
        },
        {
          title: '收益时间',
          dataIndex: 'create_time'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        const newParam = {
          ...param,
          ...this.queryParam
        }

        if (newParam.isfix < 0) {
          delete newParam.isfix
        }
        return Api.list(newParam)
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
    onChange (el) {
      this.status = el.target.value
    },
    cancelModal () {
      this.status = ''
    },
    // okModal () {
    //   const app = this
    //   const modal = this.$confirm({
    //     title: '您确认要修改订单吗?',
    //     content: '请谨慎操作',
    //     onOk () {
    //       const { order_id } = app.liveItem
    //       return Api.switchStatus({ order_id, from: { status: app.status } })
    //         .then((result) => {
    //           app.$message.success(result.message, 1.5)
    //           // 重置弹窗
    //           app.cancelVisible = false
    //           app.status = ''
    //           app.handleRefresh()
    //         })
    //         .finally(result => {
    //           modal.destroy()
    //         })
    //     }
    //   })
    // },

    /**
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh (bool = false) {
      this.$refs.table.refresh(bool)
    },

    /**
     * 删除记录
     */
    handleStatus (item) {
      this.liveItem = item
      this.liveItem.status = item.status
      this.cancelVisible = true
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
