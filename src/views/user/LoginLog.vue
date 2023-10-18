<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <!--        <a-col :span="2">-->
        <!--          <a-button  type="primary" icon="plus" @click="handleAdd">新增</a-button>-->
        <!--        </a-col>-->
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="用户ID">
            <a-input v-decorator="['user_id']" placeholder="请输入用户ID" />
          </a-form-item>
          <a-form-item label="IP地址">
            <a-input v-decorator="['ip']" placeholder="请输入IP地址" />
          </a-form-item>
          <a-form-item label="平台类型">
            <a-select v-decorator="['plat', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="1">H5</a-select-option>
              <a-select-option :value="2">APP</a-select-option>
            </a-select>
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
        <a @click="handleEdit(item)">编辑</a>
        <a @click="handleDelete(item)">删除</a>
      </div>
    </s-table>
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
          title: '用户ID',
          dataIndex: 'user_id'
        },
        {
          title: '操作系统',
          dataIndex: 'os'
        },
        {
          title: '版本号',
          dataIndex: 'version'
        },
        {
          title: '平台类型',
          dataIndex: 'plat_label'
        },
        {
          title: 'IP地址',
          dataIndex: 'ip'
        },
        {
          title: '登录时间',
          dataIndex: 'create_time'
        },
        {
          title: '登录方式',
          dataIndex: 'cate_label'
        }
        // {
        //   title: '操作',
        //   dataIndex: 'action',
        //   width: '180px',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.logList({ ...param, ...this.queryParam, cateid: 2 })
          .then(response => {
            console.log(response.data)
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

    /**
     * 新增记录
     */
    // handleAdd () {
    //   this.$refs.AddForm.add()
    // },

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
