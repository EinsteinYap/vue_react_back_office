<template>
  <a-spin :spinning="isLoading">
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item>
            <a-date-picker format="YYYY-MM-DD" v-decorator="['day']" />
          </a-form-item>
          <a-form-item class="search-btn">
            <a-button style="margin-left: -60px;margin-right: 20px;" type="primary" icon="search" html-type="submit">搜索</a-button>
          </a-form-item>

          <a-form-item>
            <a-radio-group
              @change="changeSettleModel"
              button-style="solid"
              v-decorator="['day_type', {initialValue: 'today'}]"
            >
              <a-radio-button value="all">全部</a-radio-button>
              <a-radio-button value="today">今天</a-radio-button>
              <a-radio-button value="yesterday">昨天</a-radio-button>
              <a-radio-button value="week">本周</a-radio-button>
              <a-radio-button value="last_week">上周</a-radio-button>
              <a-radio-button value="month">本月</a-radio-button>
              <a-radio-button value="last_month">上月</a-radio-button>
            </a-radio-group>

          </a-form-item>
          <div class="number-new">
            <span>平台盈利： 1321.00</span>
          </div>

        </a-form>

      </a-row>
    </div>
    <div class="container">
      <!-- 实时概况 -->
      <a-card class="overview" :bordered="false">
        <div class="card-title">
          <span>用户信息</span>
        </div>
        <a-row class="statistics mt-20" :gutter="32">
          <a-col class="item" :span="5">
            <a-card :bordered="false">
              <div class="flex flex-y-center">
                <div class="col-left">
                  <div class="icon-body flex flex-x-center flex-y-center">
                    <a-icon class="icon" :component="Icons.statistics.user" />
                  </div>
                </div>
                <div class="col-right">
                  <p class="info">注册/积分</p>
                  <p class="keynote">{{ data.user.reg_today }} / {{ data.user.reg_recharge }}</p>
                </div>
              </div>
            </a-card>
          </a-col>
          <a-col class="item" :span="5">
            <a-card :bordered="false">
              <div class="flex flex-y-center">
                <div class="col-left">
                  <div class="icon-body flex flex-x-center flex-y-center">
                    <a-icon class="icon" :component="Icons.statistics.goods" />
                  </div>
                </div>
                <div class="col-right">
                  <p class="info">参与人数</p>
                  <p class="keynote">{{ data.user.buy }}</p>
                </div>
              </div>
            </a-card>
          </a-col>
          <a-col class="item" :span="5">
            <a-card :bordered="false">
              <div class="flex flex-y-center">
                <div class="col-left">
                  <div class="icon-body flex flex-x-center flex-y-center">
                    <a-icon class="icon" :component="Icons.statistics.user" />
                  </div>
                </div>
                <div class="col-right">
                  <p class="info">当前在线</p>
                  <p class="keynote">{{ data.user.online }}</p>
                </div>
              </div>
            </a-card>
          </a-col>
<!--          <a-col class="item" :span="4">-->
<!--            <a-card :bordered="false">-->
<!--              <div class="flex flex-y-center">-->
<!--                <div class="col-left">-->
<!--                  <div class="icon-body flex flex-x-center flex-y-center">-->
<!--                    <a-icon class="icon" :component="Icons.statistics.consume" />-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class="col-right">-->
<!--                  <p class="info">今日注册/积分</p>-->
<!--                  <p class="keynote">{{ data.user.reg_today }} / {{ data.user.reg_recharge }}</p>-->
<!--                </div>-->
<!--              </div>-->
<!--            </a-card>-->
<!--          </a-col>-->
          <a-col class="item" :span="5">
            <a-card :bordered="false">
              <div class="flex flex-y-center">
                <div class="col-left">
                  <div class="icon-body flex flex-x-center flex-y-center">
                    <a-icon class="icon" :component="Icons.statistics.consume" />
                  </div>
                </div>
                <div class="col-right">
                  <p class="info">积分兑换人数</p>
                  <p class="keynote">{{ data.user.withdraw }}</p>
                </div>
              </div>
            </a-card>
          </a-col>
          <a-col class="item" :span="4">
            <a-card :bordered="false">
              <div class="flex flex-y-center">
                <div class="col-left">
                  <div class="icon-body flex flex-x-center flex-y-center">
                    <a-icon class="icon" :component="Icons.statistics.consume" />
                  </div>
                </div>
                <div class="col-right">
                  <p class="info">积分人数</p>
                  <p class="keynote">{{ data.user.recharge }}</p>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </a-card>

      <!-- 统计 -->
      <a-row class="statistics mt-20" :gutter="32">
        <a-col class="item" :span="6">
          <a-card :bordered="false">
            <div class="flex flex-y-center">
              <div class="col-left">
                <div class="icon-body flex flex-x-center flex-y-center">
                  <a-icon class="icon" :component="Icons.statistics.goods" />
                </div>
              </div>
              <div class="col-right">
                <p class="name">累计积分</p>
                <p class="value">{{ data.profit.recharge }} / {{ data.recharge.num }}笔</p>
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col class="item" :span="6">
          <a-card :bordered="false">
            <div class="flex flex-y-center">
              <div class="col-left">
                <div class="icon-body flex flex-x-center flex-y-center">
                  <a-icon class="icon" :component="Icons.statistics.user" />
                </div>
              </div>
              <div class="col-right">
                <p class="name">累计兑换</p>
                <p class="value">{{ data.profit.withdraw }} / {{ data.withdraw.num }}笔</p>
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col class="item" :span="6">
          <a-card :bordered="false">
            <div class="flex flex-y-center">
              <div class="col-left">
                <div class="icon-body flex flex-x-center flex-y-center">
                  <a-icon class="icon" :component="Icons.statistics.order" />
                </div>
              </div>
              <div class="col-right">
                <p class="name">积分兑付</p>
                <p class="value">进{{ data.profit.recharge_service }} / 兑{{ data.profit.withdraw_service }}</p>
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col class="item" :span="6">
          <a-card :bordered="false">
            <div class="flex flex-y-center">
              <div class="col-left">
                <div class="icon-body flex flex-x-center flex-y-center">
                  <a-icon class="icon" :component="Icons.statistics.consume" />
                </div>
              </div>
              <div class="col-right">
                <p class="name">平台积分已兑付</p>
                <p class="value">{{ data.profit.gain }}</p>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <a-row class="statistics mt-20" :gutter="32">
        <a-col class="item" :span="8">
          <a-card :bordered="false">
            <div class="flex flex-y-start">
              <div class="col-left">
                <div class="icon-body flex flex-x-center flex-y-center">
                  <a-icon class="icon" :component="Icons.statistics.goods" />
                </div>
              </div>
              <div class="col-right">
                <p class="name">积分统计</p>
                <p class="value">三方: {{ data.recharge.recharge }} / {{ data.recharge.num }}笔</p>
                <p class="value">人工: {{ data.recharge.artificial.money }} / {{ data.recharge.artificial.num }}笔</p>
                <p v-if="data.recharge.first.money" class="value">首次: {{ data.recharge.first.money }} / {{ data.recharge.first.num }}人</p>
                <p v-if="data.recharge.second" class="value">二次: {{ data.recharge.second.money }} / {{ data.recharge.second.num }}人</p>
                <p class="value">兑费: {{ data.recharge.recharge_service }} / {{data.recharge.num}}笔</p>
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col class="item" :span="8">
          <a-card :bordered="false">
            <div class="flex flex-y-start">
              <div class="col-left">
                <div class="icon-body flex flex-x-center flex-y-center">
                  <a-icon class="icon" :component="Icons.statistics.user" />
                </div>
              </div>
              <div class="col-right">
                <p class="name">兑付积分统计</p>
                <p class="value">兑付: {{ data.withdraw.withdraw }} / {{ data.withdraw.num }}笔</p>
                <p class="value">人工积分: {{ data.withdraw.artificial.money }} / {{ data.withdraw.artificial.num }}笔</p>
                <p v-if="data.withdraw.first.money" class="value">首次兑付: {{ data.withdraw.first.money }} / {{ data.withdraw.first.num }}人</p>
                <p v-if="data.withdraw.second.money" class="value">二次兑付: {{ data.withdraw.second.money }} / {{ data.withdraw.second.num }}人</p>
                <p class="value">积分兑付: {{ data.withdraw.withdraw_service }} / {{data.withdraw.num}}笔</p>
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col class="item" :span="8">
          <a-card :bordered="false">
            <div class="flex flex-y-start">
              <div class="col-left">
                <div class="icon-body flex flex-x-center flex-y-center">
                  <a-icon class="icon" :component="Icons.statistics.order" />
                </div>
              </div>
              <div class="col-right">
                <p class="name">其他统计</p>
                <p class="value">今日: {{ data.other.todaySettle }}</p>
                <p class="value">今日领取: {{ data.other.paper.today.amount }} / {{ data.other.paper.today.nums }}人</p>
                <p class="value">全部结算: {{ data.other.allSettle }}</p>
                <p class="value">全部红包: {{ data.other.paper.all.amount }} / {{ data.other.paper.all.nums }}</p>
                <p class="value">用户积分: {{ data.user.balance }}</p>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>

    </div>
  </a-spin>
</template>

<script>
import echarts from 'echarts'
import 'echarts/theme/fresh-cut'
import * as Api from '@/api/home'
import * as Icons from './modules/icon'

// 常用功能
const functions = [
  {
    name: '发布商品',
    icon: Icons.functions.goods,
    color: '#00BF57',
    link: '/goods/create'
  },
  {
    name: '店铺装修',
    icon: Icons.functions.decorate,
    color: '#f15858',
    link: '/page/index'
  },
  {
    name: '会员管理',
    icon: Icons.functions.user,
    color: '#139dff',
    link: '/user/index'
  },
  {
    name: '订单管理',
    icon: Icons.functions.order,
    color: '#139dff',
    link: '/order/list/all'
  },
  {
    name: '售后管理',
    icon: Icons.functions.refund,
    color: '#139dff',
    link: '/order/refund/index'
  },
  {
    name: '优惠券',
    icon: Icons.functions.coupon,
    color: '#f15858',
    link: '/market/coupon/index'
  },
  {
    name: '数据统计',
    icon: Icons.functions.statistics,
    color: '#139dff',
    link: '/statistics'
  }
]

const data = {
  other: {
    allSettle: 0,
    paper: {
      today: {
        nums: 0,
        amount: 0
      },
      all: {
        nums: 0,
        amount: 0
      }
    },
    todaySettle: 0
  },
  profit: {
    gain: 0,
    recharge: 0,
    recharge_service: 0,
    withdraw: 0,
    withdraw_service: 0,
  },
  user: {
    balance: 0,
    buy:0,
    login: 0,
    nums: 0,
    online: 0,
    recharge: 0,
    reg: 0,
    reg_recharge: 0,
    withdraw: 0
  },
  withdraw: {
    artificial: {
      money: 0,
      num: 0
    },
    first: {
      num: 0,
      money: 0
    },
    second: {
      num: 0,
      money: 0
    },
    num: 0,
    official: {
      money: 0,
      num: 0
    },
    withdraw: 0,
    withdraw_service: 0
  },
  recharge: {
    artificial: 0,
    first: {
      num: 0,
      money: 0
    },
    second: {
      num: 0,
      money: 0
    },
    num: 0,
    official: {
      money: 0,
      num: 0,
      scene: 0
    },
    recharge: 0,
    recharge_service: 0,
  }
}

export default {
  name: 'Index',
  data () {
    return {
      Icons,
      functions,
      // 正在提交
      isLoading: false,
      // 首页数据
      data,
      queryParam: {
        day_type: 'today'
      },
      searchForm: this.$form.createForm(this)
    }
  },
  created () {
    // 获取首页数据
    this.getData()
  },
  methods: {

    // 获取首页数据
    getData () {
      this.isLoading = true
      console.log(this.queryParam)
      Api.data({ ...this.queryParam })
        .then(result => {
          this.data = result.data
          // 渲染走势图
          // this.$nextTick(() => {
          //   this.myEcharts()
          // })
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    changeSettleModel (item) {
      console.log(item.target.value)
      this.queryParam = { day_type: item.target.value }
      // delete this.queryParam.day_type
      console.log('this.queryParam', this.queryParam)
      this.searchForm.resetFields('day')
      this.getData(true)
    },

    handleSearch (e) {
      e.preventDefault()
      this.searchForm.validateFields((error, values) => {
        if (!error) {
          values.day = values.day ? values.day.format('YYYY-MM-DD') : ''
          console.log('this.queryParam', this.queryParam)

          this.queryParam = { ...this.queryParam, ...values }

          if (this.queryParam.day) {
            this.searchForm.resetFields('day_type')
            delete this.queryParam.day_type
          }

          // delete this.queryParam.day_type
          // console.log('this.queryParam', this.queryParam, ...values )
          this.getData(true)
        }
      })
    },

    // 跳转到指定link
    handleLink (link) {
      const app = this
      if (!app.$auth(link)) {
        app.$message.info('很抱歉，没有该页面的访问权限')
        return false
      }
      app.$router.push(link)
    },

    // 渲染走势图
    myEcharts () {
      const { data } = this
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('main'), 'fresh-cut')

      // 指定图表的配置项和数据
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['成交量', '成交额']
        },
        toolbox: {
          show: true,
          showTitle: false,
          feature: {
            mark: { show: true },
            magicType: { show: true, type: ['line', 'bar'] }
          }
        },
        calculable: true,
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.tradeTrend.date
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '成交额',
            type: 'line',
            data: data.tradeTrend.orderTotalPrice
          },
          {
            name: '成交量',
            type: 'line',
            data: data.tradeTrend.orderTotal
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  }
}
</script>
<style lang="less" scoped>
.card-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 15px;
}

// 统计
.statistics {
  line-height: 1;

  .ant-card {
    .ant-card-body {
      height: 100%;
      padding: 30px 40px;
    }
  }

  .col-left {
    margin-right: 25px;
    font-size: 24px;
    color: #4799ff;

    .icon-body {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background-color: #eff6ff;
    }
  }

  .col-right {
    margin-top: -5px;

    .keynote {
      font-size: 26px;
    }
  }
}

// 待办事项
.pending {
  text-align: center;
  padding: 15px 0;

  .item {
    display: inline-block;
    padding: 0 20px;

    a {
      color: unset;

      &:hover {
        color: #1890ff;
      }
    }
  }

  .name {
    font-weight: bold;
    margin-bottom: 10px;
    font-size: 13.6px;
  }

  .value {
    font-weight: bold;
    color: red;
    font-size: 16px;
  }
}

// 常用功能
.functions {
  .item {
    display: block;
    padding: 13px 20px;
    cursor: pointer;
    &:hover {
      color: #1890ff;
    }
  }

  .name {
    font-size: @font-size-base;
    margin-left: 10px;
  }

  .icon {
    width: 28px;
    height: 28px;
    // background   : #139dff !important;
    color: #fff;
    font-size: @font-size-base;
    border-radius: 5px;
  }
}

// 实时概况
.overview {
  a {
    color: unset;

    &:hover {
      color: #1890ff;
    }
  }

  .item {
    padding: 13px 20px;
  }

  .col-left {
    color: #4799ff;
    font-size: 28px;
    margin-right: 35px;

    .icon-body {
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background-color: #eff6ff;
    }
  }

  .col-right {
    .name {
      font-size: @font-size-base;
      color: #666;
    }

    .value {
      color: #000;
      font-size: 24px;
    }

    .yesterday {
      display: none;
      font-size: 12px;
      color: #999;
    }
  }
}

/deep/.ant-card-body {
  padding: 15px !important;

  .col-left {
    margin-right: 10px;
  }
  .col-right {
    .name {
      font-size: 16px;
      font-weight: bold;
    }
    .value {
      color: red;
      font-size: 14px;
      line-height: 30px;
    }
  }
}

.number-new {
  position: absolute;
  right: 0;
  top: 11px;
  display: inline-flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}
</style>
