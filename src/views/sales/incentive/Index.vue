<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-col :span="2">
          <a-button  type="primary" icon="plus" @click="handleAdd">新增</a-button>
        </a-col>

        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="关键词">
            <a-input v-decorator="['keyword']" placeholder="请输入关键词" />
          </a-form-item>
          <a-form-item label="类型">
            <a-select v-decorator="['cateid', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="1">现金</a-select-option>
              <a-select-option :value="2">机器人</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-decorator="['status', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="0">关闭</a-select-option>
              <a-select-option :value="1">开启</a-select-option>
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
      <div class="actions" slot="action" slot-scope="text, item">
        <a  style="margin-right: 8px;" @click="handleEdit(item)">编辑</a>
        <a  @click="handleDelete(item)">删除</a>
      </div>
      <div slot="status_label" slot-scope="item">
        <a-tag v-if="item.status == 0" color="red">关闭</a-tag>
        <a-tag v-if="item.status == 1" color="green">正常</a-tag>
      </div>
      <div slot="cate_label" slot-scope="item">
        <span>{{ item.cateid == 1 ? '现金' : '产品' }}</span>
      </div>
<!--      cate_label-->
      <div slot="award_value" slot-scope="item">
        <span v-if="!item.award_data.goods_id">
          现金: <span style="color: red">{{ item.award_data }}</span>
        </span>
        <div style="width: 150px;white-space: pre-wrap" v-else>
          <div style="margin-bottom: 5px;">产品名称: <span style="color: red;">{{ item.award_data.goods_name }}</span></div>
          <img @click="openImages(item)" style="width: 90px;" :src="item.award_data.good_image.preview_url" />
        </div>
      </div>
    </s-table>
    <AddForm ref="AddForm" @handleSubmit="handleRefresh" />
    <EditForm ref="EditForm" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as Api from '@/api/sales/incentive'
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
          title: '规则ID',
          dataIndex: 'id'
        },
        {
          title: '规则名称',
          dataIndex: 'cname'
        },
        {
          title: '奖值',
          scopedSlots: { customRender: 'award_value' }
        },

        {
          title: '邀请人数',
          dataIndex: 'invite_num'
        },
        {
          title: '用户最低消费',
          dataIndex: 'min_consume'
        },
        {
          title: '类型',
          scopedSlots: { customRender: 'cate_label' }
        },
        {
          title: '获赠人数',
          dataIndex: 'receive_num'
        },
        {
          title: '创建时间',
          dataIndex: 'create_time'
        },
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'status_label' }
        },
        {
          title: '操作',
          dataIndex: 'action',
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
    openImages (item) {
      window.open(item.award_data.good_image.preview_url, '_blank')
    },
    /**
     * 新增记录
     */
    handleAdd () {
      this.$refs.AddForm.add()
    },
    /**
     * 编辑权限
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
