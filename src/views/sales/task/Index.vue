<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-col :span="2">
          <a-button  type="primary" icon="plus" @click="handleAdd">新增</a-button>
        </a-col>
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="任务标题">
            <a-input v-decorator="['title']" placeholder="请输入任务标题" />
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-decorator="['status', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="0">未开启</a-select-option>
              <a-select-option :value="1">开启</a-select-option>
              <a-select-option :value="2">关闭</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-decorator="['status', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="1">充值</a-select-option>
              <a-select-option :value="2">分享</a-select-option>
              <a-select-option :value="3">购买</a-select-option>
              <a-select-option :value="4">上传</a-select-option>
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
    >
      <div class="actions" slot="action" slot-scope="text, item">
        <a  @click="handleEdit(item)">编辑</a>
        <a  @click="handleDelete(item)">删除</a>
      </div>
<!--      <div slot="user_info" slot-scope="item">-->
<!--        {{ item}}-->
<!--      </div>-->
      <div slot="status_label" slot-scope="item">
        <a-tag v-if="item.status == 0" >未开启</a-tag>
        <a-tag v-if="item.status == 1" color="green">开启</a-tag>
        <a-tag v-if="item.status == 2" color="red">关闭</a-tag>
      </div>
      <div slot="time_info" slot-scope="item">
        <div>创建时间: {{ item.create_time }}</div>
        <div>结束时间: {{ item.end_time }}</div>
      </div>
      <div slot="title" slot-scope="text">
        <p class="twoline-hide">{{ text.title }}</p>
      </div>
      <div slot="images" slot-scope="item">
        <img @click="openImages(item)" style="width: 70px;" :src="item.pics[0].external_url" />
<!--        <p style="width: 150px;white-space: pre-wrap;" v-html="text"></p>-->
      </div>
      <div slot="relation_task" slot-scope="item">
        <a  @click="openModal(item)">关联任务</a>
      </div>

    </s-table>
    <AddForm ref="AddForm" @handleSubmit="handleRefresh" />
    <EditForm ref="EditForm" @handleSubmit="handleRefresh" />
    <a-modal v-model="corrVisible" title="任务关联"  ok-text="确认" @cancel="cancelModal" cancel-text="取消" @ok="okModal">
      <a-form :form="Shform">
        <a-form-item :label="`当前绑定任务`">
          <a-select v-decorator="['ids', { initialValue: correlationids }]"  @change="handleChange"  mode="multiple">
            <a-select-option v-for="co in taskCorrList" :key="co.id">
              {{ co.title }}
            </a-select-option>
          </a-select>
<!--          <a-select v-decorator="['payment_id', { rules: [{required: true, message: '请选择三方支付通道ID'}] }]">-->
<!--            <a-select-option :value="item.id" v-for="item in paymentList" :key="item.id">-->
<!--              {{ item.pay_name }}-->
<!--            </a-select-option>-->
<!--          </a-select>-->
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import * as Api from '@/api/sales/task'
import { STable } from '@/components'
import AddForm from './modules/AddForm'
import EditForm from './modules/EditForm'
import { correList } from '@/api/sales/task'

export default {
  name: 'Index',
  components: {
    STable,
    AddForm,
    EditForm
  },
  data () {
    return {
      corrVisible: false,
      // 正在加载
      isLoading: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '任务ID',
          dataIndex: 'id'
        },
        {
          title: '任务标题',
          scopedSlots: { customRender: 'title' }
        },
        {
          title: '产品图片',
          scopedSlots: { customRender: 'images' }
        },
        // {
        //   title: '任务描述',
        //   dataIndex: 'remark',
        //   scopedSlots: { customRender: 'remark' }
        // },
        {
          title: '奖励金额',
          dataIndex: 'award_money'
        },
        {
          title: '状态',
          scopedSlots: { customRender: 'status_label' }
        },
        {
          title: '时间',
          scopedSlots: { customRender: 'time_info' }
        },
        {
          title: '类型',
          dataIndex: 'cate_label'
        },
        {
          title: '按钮名称',
          dataIndex: 'btn_name'
        },
        {
          title: '关联任务',
          scopedSlots: { customRender: 'relation_task' }
        },
        // {
        //   title: '创建时间',
        //   dataIndex: 'create_time'
        // },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      taskCorrList: [],
      correlationids: [],
      liveTaskCorr: {},
      corr: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.list({ ...param, ...this.queryParam })
          .then(response => {
            return response.data.list
          })
      },
      // 当前表单元素
      searchForm: this.$form.createForm(this),
      Shform: this.$form.createForm(this)
    }
  },
  created () {
    // this.getCorrList()
  },
  methods: {
    cancelModal () {
      this.correlationids = []
      this.corrVisible = false
    },
    openModal (item) {
      this.corr = item
      this.liveTaskCorr = item
      Api.correList({id: item.id})
        .then((result) => {
          this.taskCorrList = result.data
          this.corrVisible = true
          if (item.correlation_id) {
            this.correlationids = item.correlation_id
            // this.Shform.setFieldsValue({ids: this.correlationids})
          }
        })


    },
    okModal () {
      const app = this
      app.Shform.validateFields((error, values) => {
        Api.corre({ id: this.liveTaskCorr.id , form: { ids: values.ids  }})
          .then(result => {
            app.$message.success(result.message, 1.5)
            app.corrVisible = false
            app.Shform.resetFields()
            app.handleRefresh()
          })
          .finally(result => {
            // modal.destroy()
          })
      })

      // const modal = this.$confirm({
      //   title: '你确定手动拒绝这笔提现订单吗?',
      //   content: '审核后不可撤回',
      //   onOk () {
      //     app.Shform.validateFields((error, values) => {
      //       if (!error) {
      //         return Api.audit({ id: app.currentItem.id, form: { ...values } })
      //           .then(result => {
      //             app.$message.success(result.message, 1.5)
      //             app.currentItem = {}
      //             app.applyVisible = false
      //             app.Shform.resetFields()
      //             app.handleRefresh()
      //           })
      //           .finally(result => {
      //             modal.destroy()
      //           })
      //         this.handleRefresh(true)
      //         // this.loadTotalData()
      //       }
      //     })
      //   }
      // })
    },
    handleChange(value) {
      console.log(`Selected: ${value}`);
    },
    openImages(item) {
      console.log(item)
      window.open(item.pics[0].external_url, '_blank')
    },
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
