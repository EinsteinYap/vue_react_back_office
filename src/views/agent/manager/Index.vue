<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-col :span="2">
<!--          -->
          <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
        </a-col>
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="余额金额范围">
            <a-input-number :min="0" v-decorator="['balance[0]']" placeholder="请输入金额" />
            <span> - </span>
            <a-input-number :min="0" v-decorator="['balance[1]']" placeholder="请输入金额" />
          </a-form-item>
<!--          <a-form-item label="红包范围">-->
<!--            <a-input-number :min="0" v-decorator="['start_red_paper']" placeholder="请输入金额" />-->
<!--            <span> - </span>-->
<!--            <a-input-number :min="0" v-decorator="['end_red_paper']" placeholder="请输入金额" />-->
<!--          </a-form-item>-->
          <a-form-item label="创建时间">
            <a-range-picker format="YYYY-MM-DD" v-decorator="['betweenTime']" />
          </a-form-item>
          <a-form-item label="最后登录时间">
            <a-range-picker format="YYYY-MM-DD" v-decorator="['last_login_time']" />
          </a-form-item>
          <a-form-item label="用户名">
            <a-input v-decorator="['user_name']" placeholder="请输入用户名" />
          </a-form-item>
          <a-form-item label="用户昵称">
            <a-input v-decorator="['nickname']" placeholder="请输入用户昵称" />
          </a-form-item>
          <a-form-item label="手机号码">
            <a-input v-decorator="['mobile']" placeholder="请输入手机号码" />
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-decorator="['status', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="1">正常</a-select-option>
              <a-select-option :value="0">冻结</a-select-option>
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
      <span slot="status_info" slot-scope="text">
        <a-tag :color="text ? 'green' : 'red'">{{ text ? '正常' : '冻结' }}</a-tag>
      </span>
      <span slot="cate_info" slot-scope="text">
        <span>{{ text }}</span>
      </span>
      <div slot="agent_info" slot-scope="item">
        <div>ID: <span style="color: red;">{{ item.id }}</span></div>
        <div>用户名: <span style="color: red;">{{ item.user_name }}</span></div>
        <div>昵称: <span style="color: red;">{{ item.nickname }}</span></div>
        <div>手机: <span style="color: red;">{{ item.mobile }}</span></div>
        <div>标识: <span style="color: red;">{{ item.mark }}</span></div>
        <div>地区: <span style="color: red;">{{ item.area }}</span></div>
        <div>余额: <span style="color: red;">{{ item.balance }}</span></div>
      </div>
      <div slot="user_info" slot-scope="item">
<!--        {{item.user}}-->
        <div>用户总数: <span style="color: red;">{{ item.user.user_nums }}</span></div>
        <div>充值用户: <span style="color: red;">{{ item.recharge.num }}</span></div>
        <div>总充值: <span style="color: red;">{{ item.recharge.total }}</span></div>
        <div>总提现: <span style="color: red;">{{ item.withdraw.total }}</span></div>
<!--        <div>用户余额: <span style="color: red;">{{ item.balance }}</span></div>-->
      </div>
      <div slot="order_info" slot-scope="item">
        <div>投资用户:<span style="color: red;">{{ item.order.pay_num }}</span></div>
        <div>投资:<span style="color: red;">{{ item.order.pay_money_total }}</span></div>
        <div>收益:<span style="color: red;">{{ item.order.profit }}</span></div>
      </div>
      <div slot="free_info" slot-scope="item">
        <div>充值手续费:<span style="color: red;">{{ item.recharge.service }}</span></div>
        <div>提现手续费:<span style="color: red;">{{ item.withdraw.service }}</span></div>
      </div>
      <div slot="time_info" slot-scope="item">
        <div>最新登录:<span style="color: red;">{{ item.last_login_time }}</span></div>
        <div>创建时间:<span style="color: red;">{{ item.create_time }}</span></div>
        <div>编辑时间:<span style="color: red;">{{ item.update_time }}</span></div>
      </div>
      <div class="actions" slot="action" slot-scope="text, item">
        <div>
          <a @click="handleRecharge(item)" style="margin-right: 10px;">充值</a>
          <a @click="handleDetail(item)" style="margin-right: 10px;">详情</a>
          <a @click="handleEdit(item)">编辑</a>
        </div>
        <div>
          <a @click="handleLogin(item)" style="margin-right: 10px;">快捷登录</a>
          <a @click="handleQrDelete(item)" style="margin-right: 10px;">清空谷歌验证码</a>
        </div>
        <div>
          <a @click="handleDelete(item)" style="margin-right: 10px;">删除</a>
          <a @click="handlePassword(item)">修改密码</a>
        </div>
      </div>
    </s-table>
    <AddForm ref="AddForm" @handleSubmit="handleRefresh" />
    <EditForm ref="EditForm" @handleSubmit="handleRefresh" />
    <RechargeForm ref="RechargeForm" @handleSubmit="handleRefresh" />
    <PasswordForm ref="PasswordForm" @handleSubmit="handleRefresh" />
    <DetailsForm ref="DetailsForm" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as Api from '@/api/agent/manager'
import { STable } from '@/components'
import AddForm from './modules/AddForm'
import EditForm from './modules/EditForm'
import RechargeForm from './modules/RechargeForm'
import PasswordForm from './modules/PasswordFrom'
import DetailsForm from './modules/DetailsForm'

export default {
  name: 'Index',
  components: {
    RechargeForm,
    PasswordForm,
    DetailsForm,
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
          title: '代理商信息',
          scopedSlots: { customRender: 'agent_info' }
        },
        {
          title: '用户信息',
          scopedSlots: { customRender: 'user_info' }
        },
        {
          title: '投资信息',
          scopedSlots: { customRender: 'order_info' }
        },
        {
          title: '手续费信息',
          scopedSlots: { customRender: 'free_info' }
        },
        {
          title: '时间信息',
          scopedSlots: { customRender: 'time_info' }
        },
        // {
        //   title: '类型',
        //   dataIndex: 'cate_label',
        //   width: '80px',
        //   scopedSlots: { customRender: 'cate_info' }
        // },
        {
          title: '状态',
          dataIndex: 'status',
          width: '80px',
          scopedSlots: { customRender: 'status_info' }
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

    handleQrDelete (item) {
      const app = this
      const modal = this.$confirm({
        title: '你确定要删除该账户的谷歌验证码吗?',
        content: '删除后不可恢复',
        onOk () {
          return Api.clearSecretAgent({ id: item['id'] })
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
    handleLogin (item) {
      Api.agentlogin({ id: item.id }).then(res => {
        console.log('res', res)
        window.open(`${res.data.url}?token=${res.data.token}&agentId=${res.data.agentId}`)
      })
    },
    /**
     * 新增记录
     */
    handleAdd () {
      this.$refs.AddForm.add()
    },

    handleDetail (item) {
      this.$refs.DetailsForm.handle(item)
    },

    handlePassword (item) {
      this.$refs.PasswordForm.handle(item)
    },

    // 会员充值
    handleRecharge (item) {
      this.$refs.RechargeForm.handle(item)
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
            // balance: [values.start_balance, values.end_balance],
            // red_paper: [values.start_red_paper, values.end_red_paper]
          }

          const _balance = [];
          values.balance.forEach(e => {
            if (!e) {
              _balance.push('')
            } else {
              _balance.push(e)
            }
          })
          newValues.balance = _balance
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
