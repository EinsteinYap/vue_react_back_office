<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-col :span="2">
          <a-button  type="primary" icon="plus" @click="handleAdd">新增</a-button>
        </a-col>
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="状态">
            <a-select v-decorator="['status', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="1">正常</a-select-option>
              <a-select-option :value="0">关闭</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="设备类型">
            <a-select v-decorator="['device_type', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="1">安卓</a-select-option>
              <a-select-option :value="2">苹果</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="变动时间">
            <a-range-picker format="YYYY-MM-DD" v-decorator="['betweenTime']" />
          </a-form-item>
          <a-form-item label="版本号">
            <a-input v-decorator="['version']" placeholder="请输入版本号" />
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
        <a-tag :color="text ? 'green' : 'red'">{{ text ? '正常' : '关闭' }}</a-tag>
      </span>
      <div slot="downurl" slot-scope="text, item">
        <div>下载方式: {{ item.down_way_label }}</div>
        <div>更新方式: {{ item.change_way_label }}</div>
        <div>网页: {{ item.downurl }} <a-icon @click="copyDown(item)" type="copy" /></div>
        <div>APK: {{ item.apk_downurl }}</div>
      </div>
      <div class="actions" slot="action" slot-scope="text, item">
        <a  @click="handleEdit(item)">编辑</a>
        <br />
        <a  @click="handleDelete(item)">删除</a>
      </div>
    </s-table>
    <AddForm ref="AddForm" @handleSubmit="handleRefresh" />
    <EditForm ref="EditForm" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as Api from '@/api/setting/version'
import { STable } from '@/components'
import AddForm from './modules/AddForm'
import EditForm from './modules/EditForm'

export default {
  name: 'Index',
  components: {
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
          title: 'ID',
          dataIndex: 'id'
        },
        {
          title: '编码',
          dataIndex: 'encoded'
        },
        {
          title: '版本号',
          dataIndex: 'version'
        },
        {
          title: '设备类型',
          dataIndex: 'device_type_label'
        },
        {
          title: '平台',
          dataIndex: 'plat'
        },
        {
          title: '下载地址',
          dataIndex: 'downurl',
          scopedSlots: { customRender: 'downurl' }
        },

        // {
        //   title: '下载方式',
        //   dataIndex: 'down_way_label'
        // },
        // {
        //   title: '更新方式',
        //   dataIndex: 'change_way_label'
        // },
        {
          title: '创建时间',
          dataIndex: 'create_time'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
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

    /**
     * 新增记录
     */
    handleAdd () {
      this.$refs.AddForm.add()
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
