<template>
  <a-card :bordered="false">
    <div class="card-title" v-if="!isChildern">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <!-- 搜索板块 -->
      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="昵称/手机号">
            <a-input v-decorator="['search']" placeholder="请输入昵称或者手机号" />
          </a-form-item>
          <a-form-item label="邀请人ID">
            <a-input v-decorator="['parent_id']" placeholder="请输入邀请人ID" />
          </a-form-item>
          <a-form-item label="邀请码">
            <a-input v-decorator="['invite_code']" placeholder="请输入邀请码" />
          </a-form-item>
          <a-form-item label="会员等级">
            <a-select v-decorator="['gradeId', { initialValue: 0 }]">
              <a-select-option :value="0">全部</a-select-option>
              <a-select-option
                v-for="(item, index) in gradeList"
                :key="index"
                :value="item.grade_id"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="SVIP等级">
            <a-select v-decorator="['vip_grade_id', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option
                  v-for="(item, index) in svipList"
                  :key="index"
                  :value="item.id"
              >{{ item.cname }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="用户ID">
            <a-input v-decorator="['user_id']" placeholder="用户ID" />
          </a-form-item>
<!--          <a-form-item label="用户手机号">-->
<!--            <a-input v-decorator="['mobile']" placeholder="用户手机号" />-->
<!--          </a-form-item>-->
          <a-form-item label="大转盘次数">
            <a-input v-decorator="['turntable_nums']" placeholder="大转盘次数" />
          </a-form-item>
          <a-form-item label="消费金额">
            <a-input-number :min="0" v-decorator="['pay_money[0]']" placeholder="请输入消费金额" />
            <span> - </span>
            <a-input-number :min="0" v-decorator="['pay_money[1]']" placeholder="请输入消费金额" />
          </a-form-item>
          <a-form-item label="用户余额">
            <a-input-number :min="0" v-decorator="['balance[0]']" placeholder="请输入用户余额" />
            <span> - </span>
            <a-input-number :min="0" v-decorator="['balance[1]']" placeholder="请输入用户余额" />
          </a-form-item>
          <a-form-item label="登录时间">
            <a-range-picker format="YYYY-MM-DD" v-decorator="['loginTime']" />
          </a-form-item>
          <a-form-item label="注册时间">
            <a-range-picker format="YYYY-MM-DD" v-decorator="['betweenTime']" />
          </a-form-item>
          <a-form-item label="代理商ID">
            <a-input v-decorator="['agent_id']" placeholder="代理商ID" />
          </a-form-item>
          <a-form-item label="经理ID">
            <a-input v-decorator="['manager_id']" placeholder="经理ID" />
          </a-form-item>
          <a-form-item label="员工ID">
            <a-input v-decorator="['staff_id']" placeholder="员工ID" />
          </a-form-item>
          <a-form-item label="是否提现">
            <a-select v-decorator="['is_tx', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="0">未提现</a-select-option>
              <a-select-option :value="2">已提现</a-select-option>
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
      rowKey="user_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
      :scroll="{ x: 1450 }"
    >
      <!-- 会员等级 -->
      <span slot="grade" slot-scope="item">
        <a-tag v-if="item.grade">{{ item.grade.name }}</a-tag>
        <span v-else>无等级</span>
      </span>
      <span slot="vip_grade" slot-scope="item">
        <a-tag v-if="item.vipGrade">{{ item.vipGrade.cname }}</a-tag>
        <span v-else>无等级</span>
      </span>
      <!-- 代理相关 -->
      <div slot="agent" slot-scope="item">
        <div>
          <div v-if="item.agent">代理: <span style="color: red">{{ item.agent.nickname }}</span></div>
          <div v-if="item.manager">经理: <span style="color: red">{{ item.manager.nickname }}</span></div>
          <div v-if="item.staff">员工: <span style="color: red">{{ item.staff.nickname }}</span></div>
          <div v-if="item.referer">推荐人: <span style="color: red">{{ item.referer.user_id }} / {{ item.referer.nick_name }}</span></div>
        </div>
      </div>

      <div slot="userinfo" slot-scope="item">
        <div>昵称: <span style="color: red">{{ item.nick_name }}</span></div>
        <div>邀请人数: <span style="color: red">{{ item.child_num }}</span></div>
        <div>邀请码: <span style="color: red">{{ item.invite_code }}</span></div>
        <div>大转盘次数: <span style="color: red">{{ item.turntable_nums }}</span></div>
      </div>


      <!-- 金额相关 -->
      <div slot="money" slot-scope="item">
        <div>充值: <span style="color: red">{{ item.recharge_money }}</span></div>
        <div>投资: <span style="color: red">{{ item.pay_money }}</span></div>
        <div>余额: <span style="color: red">{{ item.balance }}</span></div>
        <div>总提: <span style="color: red">{{ item.withdraw_money }}</span></div>
      </div>

      <!--      登录注册相关-->
      <div slot="lrtime" slot-scope="item">
        <div>最后登录时间:<span style="color: red">{{ item.last_login_time }}</span></div>
        <div>最后登录IP:<span style="color: red">{{ item.last_login_ip }}</span></div>
        <div>注册时间:<span style="color: red">{{ item.create_time }}</span></div>

      </div>
      <!-- 操作 -->
      <span class="actions" slot="action" slot-scope="item">
        <a title="用户充值" @click="handleRecharge(item)">充值</a>
        <!--        <a title="用户等级" v-action:grade @click="handleGrade(item)">等级</a>-->
        <a  @click="handleDelete(item)">删除</a>
        <br />
        <a @click="handleLoginStatus(item)">设置登录</a>
        <a @click="handlePassword(item)">重置密码</a>
        <br />
        <a @click="handleWithdrawStatus(item)">设置提现</a>
        <a @click="handlePaypassword(item)">支付密码</a>
        <br />
        <a @click="handleProfitStatus(item)">设置收益</a>
        <a @click="handleFreezeLogin(item)">邀请列表</a>
        <br />
        <a @click="handleParent(item)">修改上级用户</a>
        <a @click="handleStaff(item)">修改上级员工</a>
        <br />
        <a @click="handleGrade(item)">修改用户等级</a>
        <a @click="handleSvip(item)">修改SVIP等级</a>
        <br />
        <a @click="handlePhone(item)">修改手机号</a>
        <a @click="handleZS(item)">赠送商品</a>
      </span>

      <!--      国际区号-->
      <div slot="mobile" slot-scope="item">
        <div>国际区号:<span style="color: red">{{ item.area_code }}</span></div>
        <div>手机号码:<span style="color: red">{{ item.mobile }}</span></div>
      </div>

      <!--      状态相关-->
      <div slot="status" slot-scope="item">

        <div style="margin-bottom: 4px;">登录状态:
          <a-tag :color="!item.login_status ? 'green' : 'red' ">{{ !item.login_status ? '正常' : '冻结' }}</a-tag>
        </div>
        <div style="margin-bottom: 4px;">提现状态:
          <a-tag :color="!item.freeze_withdraw ? 'green' : 'red' ">{{ !item.freeze_withdraw ? '正常' : '冻结' }}</a-tag>
        </div>
        <div>收益状态:
          <a-tag :color="!item.freeze_profit ? 'green' : 'red' ">{{ !item.freeze_profit ? '正常' : '冻结' }}</a-tag>
        </div>
      </div>
    </s-table>
    <GradeForm ref="GradeForm" :gradeList="gradeList" @handleSubmit="handleRefresh" />
    <SvipForm ref="SvipForm" :gradeList="svipList" @handleSubmit="handleRefresh" />
    <RechargeForm ref="RechargeForm" @handleSubmit="handleRefresh" />
    <LoginForm ref="LoginForm" @handleSubmit="handleRefresh" />
    <ProfitForm ref="ProfitForm" @handleSubmit="handleRefresh" />
    <WithdrawForm ref="WithdrawForm" @handleSubmit="handleRefresh" />
    <ParentForm ref="ParentForm" @handleSubmit="handleRefresh" />
    <StaffForm ref="StaffForm" @handleSubmit="handleRefresh" />
    <PaypasswordForm ref="PaypasswordForm" @handleSubmit="handleRefresh" />
    <PasswordForm ref="PasswordForm" @handleSubmit="handleRefresh" />
    <AtlasForm ref="AtlasForm" @handleSubmit="handleRefresh" />
    <PhoneFrom ref="PhoneFrom" :gradeList="codeList" @handleSubmit="handleRefresh"/>
    <ZSForm ref="ZSForm" @handleSubmit="handleRefresh" />
    <UserModal ref="UserModal" />
  </a-card>
</template>

<script>
import * as Api from '@/api/user'
import * as ManagerApi from '@/api/agent/manager'
import * as GradeApi from '@/api/user/grade'
import * as SvipApi from '@/api/user/svip'
import * as GlobalApi from '@/api/globalization/code'
import { STable } from '@/components'
import { UserModal,GradeForm, RechargeForm, LoginForm, ProfitForm, WithdrawForm, ParentForm, StaffForm, PaypasswordForm, PasswordForm, AtlasForm, PhoneFrom, SvipForm, ZSForm } from './modules'
import PlatformIcon from '@/components/PlatformIcon'

export default {
  name: 'Index',
  props: {
    isChildern: {
      type: Boolean,
      default: false
    },
    childernId: {
      type: Number,
      default: -1
    }
  },
  components: {
    STable,
    PhoneFrom,
    GradeForm,
    LoginForm,
    RechargeForm,
    PlatformIcon,
    ProfitForm,
    WithdrawForm,
    ParentForm,
    StaffForm,
    PaypasswordForm,
    PasswordForm,
    AtlasForm,
    UserModal,
    SvipForm,
    ZSForm
  },
  data () {
    return {
      // 当前表单元素
      searchForm: this.$form.createForm(this),
      // 查询参数
      queryParam: {},
      // 正在加载
      isLoading: false,
      // 表头
      columns: [
        {
          title: '用户ID',
          width: 60,
          dataIndex: 'user_id'
        },
        {
          title: '用户来源',
          width: 180,
          scopedSlots: { customRender: 'agent' }
        },
        {
          title: '用户信息',
          width: 150,
          scopedSlots: { customRender: 'userinfo' }
        },
        {
          title: '国际区号/手机号码',
          width: 150,
          scopedSlots: { customRender: 'mobile' }
        },
        {
          title: '用户等级',
          width: 100,
          scopedSlots: { customRender: 'grade' }
        },
        {
          title: 'SVIP等级',
          width: 100,
          scopedSlots: { customRender: 'vip_grade' }
          // vip_grade_id
        },
        // {
        //   title: '大转盘次数',
        //   dataIndex: 'turntable_nums'
        // },
        {
          title: '当前状态',
          width: 130,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '金额相关',
          width: 130,
          scopedSlots: { customRender: 'money' }
        },

        {
          title: '登录/注册',
          width: 200,
          scopedSlots: { customRender: 'lrtime' }
        },

        {
          title: '操作',
          // dataIndex: 'action',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.list({ ...param, ...this.queryParam })
          .then(response => response.data.list)
      },
      // 会员等级列表
      gradeList: [],
      svipList: [],
      codeList: []
    }
  },
  created () {
    // 获取会员等级列表
    this.getGradeList()
    this.getSvipList()
    this.getChildLists()
    this.getCode()
  },
  methods: {
    onChange(value) {
      console.log(value);
    },
    test() {
      this.$refs.table.refresh(true)
    },
    getCode() {
      GlobalApi.list()
        .then(res => {
          this.codeList = res.data.list.data
        })
    },
    getChildLists () {
      if (this.isChildern) {
        this.queryParam = { parent_id: this.childernId }

      } else {
        ManagerApi.getAllList().then(res => {
          console.log(res.data)
        })
      }
      this.handleRefresh(true)
    },
    // 获取SVIP等级列表
    getSvipList () {
      SvipApi.all().then(result => {
        console.log('result', result)
        this.svipList = result.data
      })
    },
    // 获取会员等级列表
    getGradeList () {
      GradeApi.all().then(result => {
        this.gradeList = result.data.list
      })
    },

    handleZS(item) {
      this.$refs.ZSForm.add(item)
    },

    handlePhone (item) {
      this.$refs.PhoneFrom.handle(item)
    },

    // 修改会员等级
    handleGrade (item) {
      this.$refs.GradeForm.handle(item)
    },
    handleSvip (item) {
      this.$refs.SvipForm.handle(item)
    },

    handleFreezeLogin (item) {
      if (item.child_num <= 0) {
        return this.$message.error('该用户下没有用户图谱')
      } else {
        // this.searchForm.resetFields()
        // this.queryParam = { parent_id: item.user_id }
        this.$refs.UserModal.handle(item)
      }
    },

    // 会员充值
    handleRecharge (item) {
      this.$refs.RechargeForm.handle(item)
    },

    handleLoginStatus (item) {
      this.$refs.LoginForm.handle(item)
    },
    handleWithdrawStatus (item) {
      this.$refs.WithdrawForm.handle(item)
    },
    handleProfitStatus (item) {
      this.$refs.ProfitForm.handle(item)
    },
    handleParent (item) {
      this.$refs.ParentForm.handle(item)
    },
    handleStaff (item) {
      this.$refs.StaffForm.handle(item)
    },
    handlePassword (item) {
      this.$refs.PasswordForm.handle(item)
    },
    handlePaypassword (item) {
      this.$refs.PaypasswordForm.handle(item)
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
          return Api.deleted({ userId: item.user_id })
            .then((result) => {
              app.$message.success(result.message, 1.5)
              app.handleRefresh()
            })
            .finally(result => modal.destroy())
        }
      })
    },

    // 确认搜索
    handleSearch (e) {
      e.preventDefault()
      this.searchForm.validateFields((error, values) => {
        console.log('values', values)
        console.log(values.pay_money)
        // if (!values.pay_money[0] || !values.pay_money[1]) {
        //   delete values.pay_money
        // }
        // if (!values.balance[0] || !values.balance[1]) {
        //   delete values.balance
        // }

        delete this.queryParam.parent_id
        if (!error) {
          const _payMoney = []
          const _balance = []
          values.pay_money.forEach(e => {
            if (!e) {
              _payMoney.push('')
            } else {
              _payMoney.push(e)
            }
          })
          values.balance.forEach(e => {
            if (!e) {
              _balance.push('')
            } else {
              _balance.push(e)
            }
          })
          values.pay_money = _payMoney
          values.balance = _balance
          // console.log('values.pay_money', values.pay_money)
          // console.log('values.balance', values.balance)
          this.queryParam = { ...this.queryParam, ...values }
          this.handleRefresh(true)
        }
      })
    },

    /**
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh (bool = false) {
      // consoe.log()
      console.log('this.$refs.table', this.$refs.table)
      this.$nextTick(() => {
        this.$refs.table.refresh(bool)
      })
    }

  }
}
</script>

<style lang="less" scoped>
.ant-card-body {
  padding: 22px 29px 25px;
}
</style>
