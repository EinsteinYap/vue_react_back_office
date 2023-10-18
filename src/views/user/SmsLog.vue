<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-col :span="3">
          <a-button  type="primary" @click="handleDeleteAll">清空短信记录</a-button>
        </a-col>
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="手机号码">
            <a-input v-decorator="['mobile']" placeholder="请输入用户ID" />
          </a-form-item>
          <a-form-item label="时间段">
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
      <div class="actions" slot="action" slot-scope="text, item">
        <a  @click="handleEdit(item)">编辑</a>
        <a  @click="handleDelete(item)">删除</a>
      </div>
    </s-table>
    <a-modal v-model="deleteVisible" title="清空短信记录" ok-text="确认" cancel-text="取消" @ok="okModal">
      <div style="text-align: center;margin: 10px;">
        <a-range-picker format="YYYY-MM-DD" v-model="betweenTime" />
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import * as Api from '@/api/user/index'
import { STable } from '@/components'

export default {
  name: 'Index',
  components: {
    STable
  },
  data () {
    return {
      deleteVisible: false,
      // 清空短信时间段
      betweenTime: [],
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
          title: '发送时间',
          dataIndex: 'create_time'
        },
        {
          title: '区号',
          dataIndex: 'area'
        },
        {
          title: '手机号码',
          dataIndex: 'mobile'
        },
        {
          title: '手机验证码',
          dataIndex: 'code'
        },
        {
          title: '过期时间',
          dataIndex: 'expire_time'
        },
        {
          title: 'IP地址',
          dataIndex: 'ip'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.smsListLog({ ...param, ...this.queryParam })
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
    okModal () {
      const app = this
      const modal = this.$confirm({
        title: '您确定要清空记录吗?',
        content: '清空后不可恢复',
        onOk () {
          return Api.smsDelete({ betweenTime: app.betweenTime })
            .then((result) => {
              app.$message.success(result.message, 1.5)
              // 重置弹窗
              app.deleteVisible = false
              app.betweenTime = []
              app.handleRefresh()
            })
            .finally(result => {
              modal.destroy()
            })
        }
      })
    },
    /**
     * 新增记录
     */
    handleDeleteAll () {
      this.deleteVisible = true
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
