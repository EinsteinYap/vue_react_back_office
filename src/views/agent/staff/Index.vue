<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-col :span="2">
          <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
        </a-col>
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="所属代理ID">
            <a-input v-decorator="['agent_id']" placeholder="请输入所属代理ID" />
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
      :scroll="{ x: 1200 }"
    >
      <!-- 状态 -->
      <span slot="status" slot-scope="text">
        <a-tag :color="text ? 'green' : 'red'">{{ text ? '正常' : '冻结' }}</a-tag>
      </span>
      <div class="actions" slot="action" slot-scope="text, item">
        <a @click="handleEdit(item)">编辑</a>
        <a @click="handleDelete(item)" style="margin-right: 10px;">删除</a>
        <br />
        <a @click="handleLogin(item)" style="margin-right: 10px;">快捷登录</a>
        <a @click="handleQrDelete(item)" style="margin-right: 10px;">清空谷歌验证码</a>
        <br />
        <a @click="handlePassword(item)">修改密码</a>
        <a title="用户充值" @click="handleRecharge(item)">充值</a>
      </div>
      <div slot="agent" slot-scope="item">
        <span>{{ item.agent ? item.agent.user_name : '平台' }}</span>
      </div>
    </s-table>
    <AddForm ref="AddForm" @handleSubmit="handleRefresh" />
    <EditForm ref="EditForm" @handleSubmit="handleRefresh" />
    <PasswordForm ref="PasswordForm" @handleSubmit="handleRefresh" />
    <RechargeForm ref="RechargeForm" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as Api from '@/api/agent/staff'
import { STable } from '@/components'
import AddForm from './modules/AddForm'
import EditForm from './modules/EditForm'
import PasswordForm from './modules/PasswordFrom'
import RechargeForm from './modules/RechargeForm.vue'

export default {
  name: 'Index',
  components: {
    RechargeForm,
    PasswordForm,
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
          title: '员工ID',
          dataIndex: 'id',
          width: '80px'
        },
        {
          title: '上级员工ID',
          dataIndex: 'parent_id',
          width: '80px'
        },
        {
          title: '代理商',
          width: '100px',
          scopedSlots: { customRender: 'agent' }
        },
        {
          title: '用户名',
          width: '100px',
          dataIndex: 'user_name'
        },
        {
          title: '手机号码',
          width: '120px',
          dataIndex: 'mobile'
        },
        {
          title: '余额',
          winth: '120px',
          dataIndex: 'balance'
        },
        {
          title: '最后登录时间',
          width: '120px',
          dataIndex: 'last_login_time'
        },
        {
          title: '类型',
          width: '80px',
          dataIndex: 'cate_label'
        },
        {
          title: '推广人数',
          width: '80px',
          dataIndex: 'child_num'
        },
        {
          title: '创建时间',
          width: '120px',
          dataIndex: 'create_time'
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: '80px',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          fixed: 'right',
          width: 180,
          // width: '180px',
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
          return Api.clearSecretStaff({ id: item['id'] })
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
      Api.stafflogin({ id: item.id }).then(res => {
        console.log('res', res)
        window.open(`${res.data.url}?token=${res.data.token}&staffId=${res.data.staffId}`)
      })
    },
    // 会员充值
    handleRecharge (item) {
      this.$refs.RechargeForm.handle(item)
    },
    /**
     * 新增记录
     */
    handleAdd () {
      this.$refs.AddForm.add()
    },

    handlePassword (item) {
      this.$refs.PasswordForm.handle(item)
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
