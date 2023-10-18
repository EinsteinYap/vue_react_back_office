<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-col :span="2">
          <a-button  type="primary" icon="plus" @click="handleAdd">创建</a-button>
        </a-col>
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="红包ID">
            <a-input v-decorator="['id']" placeholder="请输入红包ID" />
          </a-form-item>
          <a-form-item label="规则">
            <a-select v-decorator="['status', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="1">随机</a-select-option>
              <a-select-option :value="2">固定</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-decorator="['status', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="0">关闭</a-select-option>
              <a-select-option :value="1">开启</a-select-option>
            </a-select>
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
      rowKey="language_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
      :scroll="{ x: 1450 }"
    >
      <div class="actions" slot="action" slot-scope="text, item">
        <a @click="loockLog(item)">领取记录</a>
        <a  @click="handleStatus(item)">设置状态</a>
      </div>
      <div class='operator' slot="operator" slot-scope="item">
        <div>操作员: <span style="color: red">{{ item.operator || '-' }}</span></div>
        <div>操作类型: <span style="color: red">{{ item.operator_cate_label || '-' }}</span></div>
      </div>
      <div class="link" slot="link" slot-scope="text">
        <a-button @click="copyDown(text)" size="small">点击复制</a-button>
      </div>
      <div slot="status_label" slot-scope="item">
        <a-tag v-if="item.status == 0" color="red">关闭</a-tag>
        <a-tag v-if="item.status == 1" color="green">正常</a-tag>
      </div>
    </s-table>
    <AddForm ref="AddForm" @handleSubmit="handleRefresh" />
    <EditForm ref="EditForm" @handleSubmit="handleRefresh" />
    <StatusForm ref="StatusForm" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as Api from '@/api/sales/paper'
import { STable } from '@/components'
import AddForm from './modules/AddForm'
import EditForm from './modules/EditForm'
import StatusForm from './modules/StatusForm.vue'

export default {
  name: 'Index',
  components: {
    StatusForm,
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
          title: '红包ID',
          dataIndex: 'id'
        },
        {
          title: '红包金额',
          dataIndex: 'amount'
        },
        {
          title: '红包剩余金额',
          dataIndex: 'balance'
        },

        {
          title: '总个数',
          dataIndex: 'total_num'
        },
        {
          title: '领取个数',
          dataIndex: 'receive_num'
        },
        {
          title: '发布时间',
          dataIndex: 'create_time'
        },
        {
          title: '结束时间',
          dataIndex: 'end_time'
        },
        {
          title: '规则',
          dataIndex: 'cate_label'
        },
        {
          title: '红包链接',
          dataIndex: 'link',
          scopedSlots: { customRender: 'link' }
        },
        {
          title: '操作员',
          scopedSlots: { customRender: 'operator' }
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'status_label' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          fixed: 'right',
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
    loockLog(item) {
      console.log(item)
      // { paper_id: item.id }
      this.$router.push({
        path: '/sales/redpackage/log',
        query: { paper_id: item.id }
      })
    },
    /**
     * 新增记录
     */
    handleAdd () {
      this.$refs.AddForm.add()
    },

    handleStatus (item) {
      this.$refs.StatusForm.handle(item)
    },

    copyDown (item) {
      this.$copyText(item).then(message => {
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
