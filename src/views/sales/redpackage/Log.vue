<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
<!--        <a-col :span="2">-->
<!--          <a-button  type="primary" icon="plus" @click="handleAdd">创建</a-button>-->
<!--        </a-col>-->
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="红包ID" >
            <a-input
              v-decorator="['paper_id', { initialValue: queryParam.paper_id ? queryParam.paper_id : ''}]"
            />
          </a-form-item>
          <a-form-item label="用户ID" >
            <a-input
              v-decorator="['user_id']"
            />
          </a-form-item>
          <a-form-item label="用户昵称" >
            <a-input
              v-decorator="['nickname']"
            />
          </a-form-item>
          <a-form-item label="手机号码" >
            <a-input
              v-decorator="['mobile']"
            />
          </a-form-item>
          <a-form-item label="金额范围">
            <a-input-number :min="0" v-decorator="['amount[0]']" placeholder="请输入金额" />
            <span> - </span>
            <a-input-number :min="0" v-decorator="['amount[1]']" placeholder="请输入金额" />
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
    >
      <div slot="user_info" slot-scope="item">
        <div v-if="item">
          <div>用户ID:<span style="color: red;">{{ item.user_id }}</span></div>
          <div>用户昵称:<span style="color: red;">{{ item.nick_name }}</span></div>
          <div>手机号码:<span style="color: red;">{{ item.mobile }}</span></div>
        </div>
        <div v-else> - </div>
      </div>
    </s-table>
  </a-card>
</template>

<script>
import * as Api from '@/api/sales/paper'
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
          title: '领取ID',
          dataIndex: 'id'
        },
        {
          title: '红包ID',
          dataIndex: 'paper_id'
        },
        {
          title: '领取金额',
          dataIndex: 'amount'
        },
        // {
        //   title: '用户ID',
        //   dataIndex: 'user_id'
        // },
        {
          title: '订单号',
          dataIndex: 'order_sn'
        },
        {
          title: '领取时间',
          dataIndex: 'create_time'
        },
        {
          title: '领取人信息',
          dataIndex: 'user',
          scopedSlots: { customRender: 'user_info' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.paperLists({ ...param, ...this.queryParam })
          .then(response => {
            return response.data.list
          })
      },
      // 当前表单元素
      searchForm: this.$form.createForm(this)
    }
  },
  created () {
    this.getPaperid()
  },
  methods: {
    getPaperid() {
      if (this.$route.query.paper_id) {
        this.queryParam.paper_id = this.$route.query.paper_id
        // 设置表单默认值
        // this.searchForm.setFieldsValue({
        //   paper_id: this.$route.params.paper_id
        // })
      }
      // if (this.$route.paper_id)
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
          const _amount = [];
          values.amount.forEach(e => {
            if (!e) {
              _amount.push('')
            } else {
              _amount.push(e)
            }
          })
          values.amount = _amount
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
