<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="用户昵称">
            <a-input v-decorator="['nick_name']" placeholder="请输入用户昵称" />
          </a-form-item>
          <a-form-item label="任务标题">
            <a-input v-decorator="['title']" placeholder="请输入任务标题" />
          </a-form-item>
          <a-form-item label="用户ID">
            <a-input v-decorator="['user_id']" placeholder="请输入用户ID" />
          </a-form-item>
          <a-form-item label="任务ID">
            <a-input v-decorator="['task_id']" placeholder="请输入任务ID" />
          </a-form-item>
          <a-form-item label="时间范围">
            <a-range-picker format="YYYY-MM-DD" v-decorator="['betweenTime']" />
          </a-form-item>
          <a-form-item label="状态">
            <a-select v-decorator="['status', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="0">未审核</a-select-option>
              <a-select-option :value="1">通过</a-select-option>
              <a-select-option :value="2">拒绝</a-select-option>
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
      rowKey="log_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
      <div slot="time_info" slot-scope="item">
        <div>创建时间:<span style="color:red;">{{ item.create_time }}</span></div>
        <div>审核时间:<span style="color:red;">{{ item.complete_time }}</span></div>
      </div>
      <div slot="user_info" slot-scope="item">
        <div v-if="item.user">
          <div>用户ID: <span style="color: red;">{{ item.user.user_id }}</span></div>
          <div>用户手机: <span style="color: red;">{{ item.user.mobile }}</span></div>
          <div>用户昵称: <span style="color: red;">{{ item.user.nick_name }}</span></div>
        </div>
        <div v-else> - </div>
      </div>
      <div class='operator' slot="operator" slot-scope="item">
        <div>操作员: <span style="color: red">{{ item.operator || '-' }}</span></div>
        <div>操作类型: <span style="color: red">{{ item.operator_cate_label || '-' }}</span></div>
      </div>
      <div slot="titles" slot-scope="item">
        <p v-if="item" class="twoline-hide" >{{ item.title ? item.title : '-' }}</p>
        <span v-else>-</span>
      </div>
      <div class="pics" slot="pics" slot-scope="pics">
        <img @click="openImages(pic)" style="width: 50px;margin-right: 5px;" v-for="(pic, index) in pics" :key="index" :src="pic.external_url" />
      </div>
      <div class="pics" slot="videos" slot-scope="videos">
        <img @click="openVideo(video)" style="width: 50px;margin-right: 5px;" v-for="(video, index) in videos" :key="index" :src="video.preview_url" />
      </div>
      <span slot="action" slot-scope="item">
        <a v-if="item.audit_status == 0" @click="handleAudit(item)">审核</a>
        <span v-else>已操作</span>
      </span>
    </s-table>
    <a-modal v-model="applyVisible" title="审核任务" ok-text="确认" cancel-text="取消" @ok="okModal">
      <div style="text-align: center;margin: 10px;">
        <a-radio-group v-model="reason" >
          <a-radio :value="0">未审核</a-radio>
          <a-radio :value="1">通过</a-radio>
          <a-radio :value="2">拒绝</a-radio>
        </a-radio-group>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import * as Api from '@/api/sales/task'
import { STable } from '@/components'
export default {
  name: 'Index',
  components: {
    STable
  },
  data () {
    return {
      applyVisible: false,
      currentItem: {},
      reason: '',
      // 正在加载
      isLoading: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '编号',
          dataIndex: 'id'
        },
        {
          title: '用户信息',
          scopedSlots: { customRender: 'user_info' }
        },
        {
          title: '任务ID',
          dataIndex: 'task.id'
        },
        {
          title: '任务标题',
          dataIndex: 'task',
          scopedSlots: { customRender: 'titles' }
        },
        {
          title: '奖励金额',
          dataIndex: 'award_money'
        },
        {
          title: '时间',
          scopedSlots: { customRender: 'time_info' }
        },
        {
          title: '状态',
          dataIndex: 'status_label'
        },
        {
          title: '图片素材',
          dataIndex: 'pics',
          width: 200,
          scopedSlots: { customRender: 'pics' }
        },
        {
          title: '操作员',
          scopedSlots: { customRender: 'operator' }
        },
        // {
        //   title: '视频素材',
        //   dataIndex: 'videos',
        //   width: 200,
        //   scopedSlots: { customRender: 'videos' }
        // },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }

      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.logList({ ...param, ...this.queryParam })
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
    openVideo(item) {
      window.open(item.external_url, '_blank')
    },
    openImages(item) {
      window.open(item.external_url, '_blank')
    },
    okModal () {
      const app = this
      const modal = this.$confirm({
        title: '你确定手动审核这个任务吗?',
        content: '请谨慎操作',
        onOk () {
          return Api.apply({ id: app.currentItem.id, form: { audit_status: app.reason } })
            .then(result => {
              app.$message.success(result.message, 1.5)
              app.currentItem = {}
              app.reason = ''
              app.applyVisible = false
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

    handleAudit (item) {
      this.currentItem = item
      console.log(item)
      this.reason = item.audit_status
      this.applyVisible = true
    },

    // handleAudit
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

.pics {
  display: flex;
  align-items: center;
  //justify-content: center;
  flex-wrap: wrap;
  //flex-direction: column;
}

</style>
