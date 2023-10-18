<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="订单号">
            <a-input v-decorator="['order_no']" placeholder="请输入订单号" />
          </a-form-item>
          <a-form-item label="充值类型">
            <a-select v-decorator="['mode', { initialValue: 'all' }]">
              <a-select-option value="all">全部</a-select-option>
              <a-select-option value="inc">增加</a-select-option>
              <a-select-option value="dec">减少</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="充值时间">
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
      <!-- 状态 -->
      <span slot="status" slot-scope="text">
        <a-tag :color="text ? 'green' : 'red'">{{ text ? '正常' : '冻结' }}</a-tag>
      </span>

      <div slot="agent" slot-scope="item">
        <div>代理商ID: <span style="color:red;">{{ item.agent.id }}</span></div>
        <div>代理商用户名: <span style="color:red;">{{ item.agent.user_name }}</span></div>
      </div>

      <div slot="staff_info" slot-scope="item">
        <div>员工ID: <span style="color:red;">{{ item.staff.id }}</span></div>
        <div>员工用户名: <span style="color:red;">{{ item.staff.user_name }}</span></div>
        <div>员工昵称: <span style="color:red;">{{ item.staff.nickname }}</span></div>
      </div>

    </s-table>
  </a-card>
</template>

<script>
import * as Api from '@/api/agent/staff'
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
          title: '员工信息',
          scopedSlots: { customRender: 'staff_info' }
        },
        {
          title: '订单号',
          dataIndex: 'order_no'
        },
        {
          title: '场景',
          dataIndex: 'scene_label'
        },
        {
          title: '类型',
          dataIndex: 'cate_label'
        },
        {
          title: '金额',
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
        },
        {
          title: '操作员',
          dataIndex: 'operator'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.logList({ ...param, ...this.queryParam })
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
