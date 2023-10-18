<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="奖项ID">
            <a-input v-decorator="['options_id']" placeholder="请输入关键词" />
          </a-form-item>
          <a-form-item class="search-btn">
            <a-button type="primary" icon="search" html-type="submit">搜索</a-button>
          </a-form-item>
        </a-form>
      </a-row>
    </div>
    <s-table
      ref="table"
      rowKey="log_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
      <!--      user_info-->
      <!--      options_info-->
      <div slot="user_info" slot-scope="item">
        <div v-if="item">
          <div>用户ID:<span style="color: red;">{{ item.user_id }}</span></div>
          <div>用户昵称:<span style="color: red;">{{ item.nick_name }}</span></div>
          <div>手机号码:<span style="color: red;">{{ item.mobile }}</span></div>
          <div>平台:<span style="color: red;">{{ item.platform }}</span></div>
        </div>
        <div v-else> - </div>
      </div>
      <div slot="options_info" slot-scope="item">
        <div v-if="item">
          <div>奖项id:<span style="color: red;">{{ item.id }}</span></div>
          <div>奖项名称:<span style="color: red;">{{ item.cname }}</span></div>
          <div>奖项类型:
            <span v-if="item.cateid == 1" style="color: red;">现金</span>
            <span v-if="item.cateid == 2" style="color: red;">积分</span>
            <span v-if="item.cateid == 3" style="color: red;">产品</span>
            <span v-if="item.cateid == 4" style="color: red;">谢谢惠顾</span>
          </div>
          <div>奖值:<span style="color: red;">{{ item.value }}</span></div>
        </div>
        <div v-else> - </div>
      </div>
      <div slot="cateid" slot-scope="item">
        <div v-if="item == 1">现金</div>
        <div v-if="item == 2">积分</div>
        <div v-if="item == 3">产品</div>
        <div v-if="item == 4">谢谢惠顾</div>
      </div>
      <div slot="value_info" slot-scope="item">
        <div v-if="item.goods_id" class="">
          <div>产品ID: <span style="color: red;">{{ item.goods_id }}</span></div>
          <div>产品名称: <span style="color: red;">{{ item.goods_name }}</span></div>
        </div>
        <div v-else> {{ item ? item : '-' }} </div>
      </div>
    </s-table>
  </a-card>
</template>

<script>
import * as Api from '@/api/sales/dial'
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
          title: '抽奖ID',
          dataIndex: 'id'
        },
        {
          title: '抽奖人ID',
          dataIndex: 'user_id'
        },
        {
          title: '抽奖类型',
          dataIndex: 'options.cateid',
          scopedSlots: { customRender: 'cateid' }
        },
        {
          title: '抽奖时间',
          dataIndex: 'create_time'
        },
        {
          title: '抽奖用户信息',
          dataIndex: 'user',
          scopedSlots: { customRender: 'user_info' }
        },
        {
          title: '抽奖奖项信息',
          dataIndex: 'options',
          scopedSlots: { customRender: 'options_info' }
        },
        {
          title: '奖值信息',
          dataIndex: 'options.value_item',
          scopedSlots: { customRender: 'value_info' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.log({ ...param, ...this.queryParam })
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
