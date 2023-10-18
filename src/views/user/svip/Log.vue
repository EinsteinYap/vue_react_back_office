<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <!-- 搜索板块 -->
      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="用户ID">
            <a-input v-decorator="['user_id']" placeholder="请输入用户ID" />
          </a-form-item>
          <a-form-item label="变更类型">
            <a-select v-decorator="['change_type', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option
                  v-for="(item, index) in changeTypeList"
                  :key="index"
                  :value="item.value"
              >{{ item.name }}</a-select-option>
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
      rowKey="grade_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
      <div slot="userinfo" slot-scope="item">
        <div>用户ID: <span style="color: red">{{ item.user.user_id }}</span></div>
        <div>昵称: <span style="color: red">{{ item.user.nick_name }}</span></div>
        <div>手机号: <span style="color: red">{{ item.user.mobile }}</span></div>
      </div>

      <div slot="changeInfo" slot-scope="item">
        <div>{{ changeTypeList.find(e => item.change_type === item.change_type).name }}</div>
      </div>

      <!-- 操作 -->
      <span slot="action" slot-scope="text, item">
        <a  style="margin-right: 8px;" @click="handleEdit(item)">编辑</a>
        <a  @click="handleDelete(item)">删除</a>
      </span>
    </s-table>
    <AddForm ref="AddForm" @handleSubmit="handleRefresh" />
    <EditForm ref="EditForm" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as Api from '@/api/user/svip'
import { STable } from '@/components'
import { AddForm, EditForm } from './modules'
import * as GradeApi from "@/api/user/grade";

export default {
  name: 'Index',
  components: {
    STable,
    AddForm,
    EditForm
  },
  data () {
    return {
      // 当前表单元素
      searchForm: this.$form.createForm(this),
      currency_short: localStorage.getItem('currency_short'),
      changeTypeList: [],
      // 查询参数
      queryParam: {},
      // 正在加载
      isLoading: false,
      // 表头
      columns: [
        {
          title: '编号ID',
          dataIndex: 'log_id'
        },
        {
          title: '用户信息',
          scopedSlots: { customRender: 'userinfo' }
        },
        {
          title: '旧等级',
          dataIndex: 'old_grade.name'
        },
        {
          title: '新等级',
          dataIndex: 'new_grade.name'
        },
        {
          title: '变更类型',
          scopedSlots: { customRender: 'changeInfo' }
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   // width: '180px',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.log({ ...param, ...this.queryParam })
          .then(response => {
            return response.data.list
          })
      }
    }
  },
  created () {
    this.getChangeTypeList()
  },
  methods: {
    /**
     * 获取变更类型列表
     */
    getChangeTypeList() {
      Api.types().then(result => {
        this.changeTypeList = result.data
      })
    },
    /**
     * 新增记录
     */
    handleAdd () {
      this.$refs.AddForm.add()
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
          this.queryParam = { ...this.queryParam, ...values }
          this.handleRefresh(true)
        }
      })
    },

  }
}
</script>
