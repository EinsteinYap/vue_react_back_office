<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <!--      <a-button  type="primary" icon="plus" @click="handleAdd">新增</a-button>-->
      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="IP地址">
            <a-input v-decorator="['ip']" placeholder="请输入IP地址" />
          </a-form-item>
          <a-form-item label="管理员ID">
            <a-input v-decorator="['store_user_id']" placeholder="请输入管理员ID" />
          </a-form-item>
          <a-form-item label="URL地址">
            <a-input v-decorator="['url']" placeholder="请输入url" />
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
    <s-table
      ref="table"
      rowKey="grade_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
      <template slot="user_agent" slot-scope="text">
        <div style="white-space: pre-wrap;">{{ text }}</div>
      </template>
      <div slot="remark" slot-scope="text">
        <div style="width: 100px;white-space: pre-wrap">{{ text }}</div>
      </div>
    </s-table>
  </a-card>
</template>

<script>
import * as Api from '@/api/store/log'
import { STable } from '@/components'

export default {
  name: 'Index',
  components: {
    STable
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 正在加载
      isLoading: false,
      // 表头
      columns: [
        {
          title: '日志ID',
          dataIndex: 'id'
        },
        {
          title: '管理员ID',
          dataIndex: 'store_user_id'
        },
        {
          title: '地址',
          dataIndex: 'url'
        },
        {
          title: 'IP地址',
          dataIndex: 'ip'
        },
        {
          title: '操作系统',
          dataIndex: 'os'
        },
        {
          title: '浏览器',
          dataIndex: 'user_agent',
          scopedSlots: { customRender: 'user_agent' }
        },
        {
          title: '操作员',
          dataIndex: 'store_user.user_name'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作时间',
          dataIndex: 'create_time'
        }
      ],
      // 当前表单元素
      searchForm: this.$form.createForm(this),
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.list({ ...param, ...this.queryParam })
          .then(response => {
            return response.data.list
          })
      }
    }
  },
  created () {

  },
  methods: {

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

    // /**
    //  * 删除记录
    //  */
    // handleDelete (item) {
    //   const app = this
    //   const modal = this.$confirm({
    //     title: '您确定要删除该记录吗?',
    //     content: '删除后不可恢复',
    //     onOk () {
    //       return Api.deleted({ gradeId: item.grade_id })
    //         .then((result) => {
    //           app.$message.success(result.message, 1.5)
    //           app.handleRefresh()
    //         })
    //         .finally(result => {
    //           modal.destroy()
    //         })
    //     }
    //   })
    // },
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
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh (bool = false) {
      this.$refs.table.refresh(bool)
    }
  }
}
</script>
