// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import * as Icons from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

/**
 * 路由配置说明：
 * 建议：sider menu 请不要超过三级菜单，若超过三级菜单，则应该设计为顶部主菜单 配合左侧次级菜单
// {
//   redirect: noredirect,  //重定向
//   name: 'router-name',   //路由名称
//   hidden: true,          //可以在菜单中不展示这个路由，包括子路由。效果可以查看 other 下的路由配置。
//   meta: {
//     title: 'title',      //菜单项名称
//     icon: 'a-icon',      //菜单项图标
//     keepAlive: true,     //缓存页面
//     permission：[string]   //用来配置这个路由的权限，如果配置了将会验证当前用户的权限，并决定是否展示 *（默认情况下）
//   }
// }
 **/
export const asyncRouterMap = [

  {
    path: '/',
    name: 'root',
    component: BasicLayout,
    children: [

      // 后台首页
      {
        path: '/index',
        name: 'index',
        component: () => import(/* webpackChunkName: "index" */ '@/views/index/Index'),
        meta: { title: '总后台-首页', keepAlive: true, icon: Icons.home, permission: ['/index'] }
      },

      // 管理员
      {
        path: '/manage',
        name: 'manage',
        component: RouteView,
        redirect: '/manage/user/index',
        meta: { title: '权限管理', icon: Icons.manage, permission: ['/manage'] },
        children: [
          {
            path: '/manage/user/index',
            component: () => import(/* webpackChunkName: "manage" */ '@/views/manage/user/Index'),
            meta: { title: '管理员列表', keepAlive: false, permission: ['/manage/user/index'] }
          },
          {
            path: '/manage/log/index',
            component: () => import(/* webpackChunkName: "manage" */ '@/views/manage/log/Index.vue'),
            meta: { title: '管理员日志', keepAlive: false, permission: ['/manage/log/index'] }
          },
          {
            path: '/manage/role/index',
            component: () => import(/* webpackChunkName: "manage" */ '@/views/manage/role/Index'),
            meta: { title: '角色管理', keepAlive: false, permission: ['/manage/role/index'] }
          },
          {
            path: '/manage/menu/index',
            component: () => import(/* webpackChunkName: "manage" */ '@/views/manage/menu/Index'),
            meta: { title: '菜单规则', keepAlive: false, permission: ['/manage/menu/index'] }
          },
          {
            path: '/manage/api/index',
            component: () => import(/* webpackChunkName: "manage" */ '@/views/manage/menu/access/Index'),
            meta: { title: 'API权限', keepAlive: false, permission: ['/manage/menu/access/index'] }
          }
        ]
      },
      // 商品管理
      {
        path: '/goods',
        name: 'goods',
        component: RouteView,
        redirect: '/goods/index',
        meta: { title: '产品管理', icon: Icons.goods, permission: ['/goods'] },
        children: [
          {
            path: '/goods/index',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/Index'),
            meta: { title: '产品列表', keepAlive: false, permission: ['/goods/index'] },
            // 访问其他页面时激活该菜单(router-link-active)
            activePath: ['/goods/create', '/goods/update']
          },
          {
            path: '/goods/create',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/Create'),
            meta: { title: '创建产品', keepAlive: false, permission: ['/goods/create'] },
            hidden: true
          },
          {
            path: '/goods/update',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/Update'),
            meta: { title: '编辑产品', keepAlive: false, permission: ['/goods/update'] },
            hidden: true
          }
        ]
      },
      // 新订单管理
      {
        path: '/order',
        name: 'order',
        component: RouteView,
        redirect: '/order/list',
        meta: { title: '订单管理', icon: Icons.order, permission: ['/order'] },
        children: [
          {
            path: '/order/list',
            component: () => import(/* webpackChunkName: "order" */ '@/views/neworder/order/Index'),
            meta: { title: '订单列表', keepAlive: false, permission: ['/order/list'] }
          },
          {
            path: '/order/income',
            component: () => import(/* webpackChunkName: "order" */ '@/views/neworder/icome/Index'),
            meta: { title: '收益记录', keepAlive: false, permission: ['/order/income'] }
          }
        ]
      },

      // 会员管理
      {
        path: '/user',
        name: 'user',
        component: RouteView,
        meta: { title: '用户管理', icon: Icons.user, permission: ['/user'] },
        children: [
          {
            path: '/user/index',
            component: () => import(/* webpackChunkName: "user" */ '@/views/user/Index'),
            meta: { title: '用户列表', keepAlive: false, permission: ['/user/index'] }
          },
          {
            path: '/user/loginlog',
            component: () => import(/* webpackChunkName: "user" */ '@/views/user/LoginLog'),
            meta: { title: '登录日志', keepAlive: false, permission: ['/user/loginlog'] }
          },
          {
            path: '/user/smslog',
            component: () => import(/* webpackChunkName: "user" */ '@/views/user/SmsLog'),
            meta: { title: '短信记录', keepAlive: false, permission: ['/user/smslog'] }
          },
          {
            path: '/user/grade/index',
            component: () => import(/* webpackChunkName: "user" */ '@/views/user/grade/Index'),
            meta: { title: '用户等级', keepAlive: false, permission: ['/user/grade/index'] }
          },
          {
            path: '/user/svip/index',
            component: () => import(/* webpackChunkName: "user" */ '@/views/user/svip/Index'),
            meta: { title: 'SVIP等级', keepAlive: false, permission: ['/user/svip/index'] }
          },
          {
            path: '/user/svip/log',
            component: () => import(/* webpackChunkName: "user" */ '@/views/user/svip/Log'),
            meta: { title: '升级记录', keepAlive: false, permission: ['/user/svip/Log'] }
          }
        ]
      },

      {
        path: '/funds',
        name: 'funds',
        component: RouteView,
        meta: { title: '用户资金', icon: Icons.content, permission: ['/funds'] },
        children: [
          {
            path: '/funds/recharge',
            component: RouteView,
            redirect: '/funds/recharge/success',
            meta: { title: '充值记录', keepAlive: false, permission: ['/funds/recharge'] },
            children: [
              {
                path: '/funds/recharge/fail',
                component: () => import(/* webpackChunkName: "funds" */ '@/views/funds/RechargeListFail.vue'),
                meta: { title: '待支付', keepAlive: false, permission: ['/funds/recharge/fail'] },
              },
              {
                path: '/funds/recharge/success',
                component: () => import(/* webpackChunkName: "funds" */ '@/views/funds/RechargeListSuccess.vue'),
                meta: { title: '已支付', keepAlive: false, permission: ['/funds/recharge/success'] },
              },
              {
                path: '/funds/recharge/error',
                component: () => import(/* webpackChunkName: "funds" */ '@/views/funds/RechargeListError.vue'),
                meta: { title: '已失败', keepAlive: false, permission: ['/funds/recharge/error'] },
              },
            ]
          },
          {
            path: '/funds/withdrawLog',
            component: RouteView,
            redirect: '/funds/withdraw/padding',
            meta: { title: '提现记录', keepAlive: false, permission: ['/funds/withdrawLog'] },
            children: [
              {
                path: '/funds/withdraw/padding',
                component: () => import(/* webpackChunkName: "funds" */ '@/views/funds/WithdrawListPadding.vue'),
                meta: { title: '待审核', keepAlive: false, permission: ['/funds/withdraw/padding'] },
              },
              {
                path: '/funds/withdraw/pay',
                component: () => import(/* webpackChunkName: "funds" */ '@/views/funds/WithdrawListPay.vue'),
                meta: { title: '支付中', keepAlive: false, permission: ['/funds/withdraw/pay'] },
              },
              {
                path: '/funds/withdraw/success',
                component: () => import(/* webpackChunkName: "funds" */ '@/views/funds/WithdrawListSuccess.vue'),
                meta: { title: '已完成', keepAlive: false, permission: ['/funds/withdraw/success'] },
              },
              {
                path: '/funds/withdraw/back',
                component: () => import(/* webpackChunkName: "funds" */ '@/views/funds/WithdrawListBack.vue'),
                meta: { title: '已退回', keepAlive: false, permission: ['/funds/withdraw/back'] },
              },
              {
                path: '/funds/withdraw/error',
                component: () => import(/* webpackChunkName: "funds" */ '@/views/funds/WithdrawListError.vue'),
                meta: { title: '已失败', keepAlive: false, permission: ['/funds/withdraw/error'] },
              }
            ]
          },
          {
            path: '/funds/financial',
            component: () => import(/* webpackChunkName: "funds" */ '@/views/funds/Financial.vue'),
            meta: { title: '资金明细', keepAlive: false, permission: ['/funds/financial'] }
          },
          {
            path: '/funds/withdrawAccount',
            component: () => import(/* webpackChunkName: "funds" */ '@/views/funds/WithdrawAccount.vue'),
            meta: { title: '提现账户', keepAlive: false, permission: ['/funds/withdrawAccount'] }
          }
        ]
      },
      // 代理商
      {
        path: '/agent',
        name: 'agent',
        component: RouteView,
        meta: { title: '代理商', icon: Icons.market, permission: ['/agent'] },
        children: [
          {
            path: '/agent/manager',
            component: () => import(/* webpackChunkName: "market" */ '@/views/agent/manager/Index'),
            meta: { title: '代理商列表', keepAlive: false, permission: ['/agent/manager'] }
          },
          {
            path: '/agent/staff',
            component: () => import(/* webpackChunkName: "market" */ '@/views/agent/staff/Index'),
            meta: { title: '代理商员工', keepAlive: false, permission: ['/agent/staff'] }
          },
          {
            path: '/agent/record',
            redirect: '/agent/record/balance',
            component: RouteView,
            // component: () => import(/* webpackChunkName: "market" */ '@/views/agent/record/Index'),
            meta: { title: '代理商记录', keepAlive: false, permission: ['/agent/record'] },
            children: [
              {
                path: '/agent/record/balance',
                component: () => import(/* webpackChunkName: "market" */ '@/views/agent/record/Balance'),
                meta: { title: '余额列表', keepAlive: false, permission: ['/agent/record/balance'] }
              },
              {
                path: '/agent/record/packet',
                component: () => import(/* webpackChunkName: "market" */ '@/views/agent/record/Packet'),
                meta: { title: '红包列表', keepAlive: false, permission: ['/agent/record/packet'] }
              }
            ]
          },
          {
            path: '/agent/log',
            component: () => import(/* webpackChunkName: "market" */ '@/views/agent/Log.vue'),
            meta: { title: '操作日志', keepAlive: false, permission: ['/agent/log'] }
          },
          {
            path: '/agent/staffLog',
            component: () => import(/* webpackChunkName: "market" */ '@/views/agent/staff/BalanceLog.vue'),
            meta: { title: '员工余额列表', keepAlive: false, permission: ['/agent/staffLog'] }
          }
        ]
      },
      {
        path: '/trilateral',
        name: 'trilateral',
        component: RouteView,
        meta: { title: '三方支付', icon: Icons.content, permission: ['/trilateral'] },
        children: [
          {
            path: '/trilateral/paytype',
            component: () => import(/* webpackChunkName: "trilateral" */ '@/views/trilateral/type/Index.vue'),
            meta: { title: '支付类型', keepAlive: false, permission: ['/trilateral/paytype'] }
          },
          {
            path: '/trilateral/mode',
            component: () => import(/* webpackChunkName: "trilateral" */ '@/views/trilateral/mode/Index.vue'),
            meta: { title: '支付方式', keepAlive: false, permission: ['/trilateral/mode'] }
          },
          {
            path: '/trilateral/currency',
            component: () => import(/* webpackChunkName: "trilateral" */ '@/views/trilateral/currency/Index.vue'),
            meta: { title: '币种', keepAlive: false, permission: ['/trilateral/currency'] }
          }
        ]
      },

      // 内容管理
      {
        path: '/content',
        name: 'content',
        component: RouteView,
        meta: { title: '内容管理', icon: Icons.content, permission: ['/content'] },
        children: [
          {
            path: '/content/article',
            component: RouteView,
            redirect: '/content/article/index',
            meta: { title: '文章管理', keepAlive: false, permission: ['/content/article'] },
            children: [
              {
                path: '/content/article/index',
                component: () => import(/* webpackChunkName: "content" */ '@/views/content/article/Index'),
                meta: { title: '文章列表', keepAlive: false, permission: ['/content/article/index'] }
              },
              {
                path: '/content/article/category/index',
                component: () => import(/* webpackChunkName: "content" */ '@/views/content/article/category/Index'),
                meta: { title: '文章类别', keepAlive: false, permission: ['/content/article/category/index'] }
              }
            ]
          },
          {
            path: '/content/files',
            component: RouteView,
            redirect: '/content/files/index',
            meta: { title: '文件库管理', keepAlive: false, permission: ['/content/files'] },
            children: [
              {
                path: '/content/files/storage',
                component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/Storage'),
                meta: { title: '上传设置', keepAlive: false, permission: ['/setting/storage'] }
              },
              {
                path: '/content/files/index',
                component: () => import(/* webpackChunkName: "content" */ '@/views/content/files/Index'),
                meta: { title: '文件列表', keepAlive: false, permission: ['/content/files/index'] }
              },
              {
                path: '/content/files/group/index',
                component: () => import(/* webpackChunkName: "content" */ '@/views/content/files/group/Index'),
                meta: { title: '文件分组', keepAlive: false, permission: ['/content/files/group/index'] }
              }
            ]
          },
          {
            path: '/content/help/index',
            component: () => import(/* webpackChunkName: "content" */ '@/views/content/help/Index'),
            meta: { title: '帮助中心', keepAlive: false, permission: ['/content/help/index'] }
          }
        ]
      },

      {
        path: '/sales',
        name: 'sales',
        component: RouteView,
        meta: { title: '营销管理', icon: Icons.market, permission: ['/sales'] },
        children: [
          {
            path: '/sales/dial',
            component: RouteView,
            redirect: '/sales/dial/index',
            meta: { title: '大转盘活动', keepAlive: false, permission: ['/sales/dial'] },
            children: [
              {
                path: '/sales/dial/index',
                meta: { title: '奖项管理', keepAlive: false, permission: ['/sales/dial/index'] },
                component: () => import(/* webpackChunkName: "market" */ '@/views/sales/dial/Index')
              },
              {
                path: '/sales/dial/log',
                meta: { title: '抽奖记录', keepAlive: false, permission: ['/market/dial/log'] },
                component: () => import(/* webpackChunkName: "market" */ '@/views/sales/dial/Log')
              }
            ]
          },
          {
            path: '/sales/give',
            meta: { title: '赠送活动', keepAlive: false, permission: ['/sales/give'] },
            component: () => import(/* webpackChunkName: "market" */ '@/views/sales/give/Index')
          },
          {
            path: '/sales/bargain',
            meta: { title: '砍价活动', keepAlive: false, permission: ['/sales/bargain'] },
            component: () => import(/* webpackChunkName: "market" */ '@/views/sales/bargain/Index')
          },
          {
            path: '/sales/crowd',
            meta: { title: '众筹活动', keepAlive: false, permission: ['/sales/crowd'] },
            component: () => import(/* webpackChunkName: "market" */ '@/views/sales/crowd/Index')
          },
          {
            path: '/sales/redpackage',
            meta: { title: '红包活动', keepAlive: false, permission: ['/sales/redpackage'] },
            component: RouteView,
            redirect: '/sales/redpackage/index',
            children: [
              {
                path: '/sales/redpackage/index',
                meta: { title: '红包记录', keepAlive: false, permission: ['/sales/redpackage/index'] },
                component: () => import(/* webpackChunkName: "market" */ '@/views/sales/redpackage/Index')
              },
              {
                path: '/sales/redpackage/log',
                meta: { title: '领取记录', keepAlive: false, permission: ['/sales/redpackage/log'] },
                component: () => import(/* webpackChunkName: "market" */ '@/views/sales/redpackage/Log')
              }
            ]
          },
          {
            path: '/sales/task',
            meta: { title: '任务活动', keepAlive: false, permission: ['/sales/task'] },
            component: RouteView,
            redirect: '/sales/task/index',
            children: [
              {
                path: '/sales/task/index',
                meta: { title: '任务列表', keepAlive: false, permission: ['/sales/task/index'] },
                component: () => import(/* webpackChunkName: "market" */ '@/views/sales/task/Index')
              },
              {
                path: '/sales/task/audit',
                meta: { title: '任务审核', keepAlive: false, permission: ['/sales/task/audit'] },
                component: () => import(/* webpackChunkName: "market" */ '@/views/sales/task/Audit')
              }
            ]
          },
          {
            path: '/market/incentive',
            meta: { title: '邀请奖励活动', keepAlive: false, permission: ['/market/incentive'] },
            component: () => import(/* webpackChunkName: "market" */ '@/views/sales/incentive/Index')
          },
          {
            path: '/market/coupon',
            component: RouteView,
            redirect: '/market/coupon/index',
            meta: { title: '优惠券', keepAlive: false, permission: ['/market/coupon'] },
            children: [
              {
                path: '/market/coupon/index',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/coupon/Index'),
                meta: { title: '优惠券列表', keepAlive: false, permission: ['/market/coupon/index'] },
                // 访问其他页面时激活该菜单(router-link-active)
                activePath: ['/market/coupon/create', '/market/coupon/update']
              },
              {
                path: '/market/coupon/create',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/coupon/Create'),
                meta: { title: '创建优惠券', keepAlive: false, permission: ['/market/coupon/create'] },
                hidden: true
              },
              {
                path: '/market/coupon/update',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/coupon/Update'),
                meta: { title: '编辑优惠券', keepAlive: false, permission: ['/market/coupon/update'] },
                hidden: true
              },
              {
                path: '/market/coupon/receive/index',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/coupon/Receive'),
                meta: { title: '领券记录', keepAlive: false, permission: ['/market/coupon/receive/index'] }
              }
            ]
          }
        ]
      },
      // 常规设置
      {
        path: '/system',
        name: 'system',
        component: RouteView,
        meta: { title: '系统设置', icon: Icons.setting, permission: ['/system'] },
        children: [
          {
            path: '/system/apps',
            redirect: '/system/apps/basic',
            component: RouteView,
            meta: { title: '常规设置', keepAlive: false, permission: ['/system/apps'] },
            children: [
              {
                path: '/system/apps/basic',
                component: () => import(/* webpackChunkName: "system" */ '@/views/system/apps/Basic'),
                meta: { title: '基本配置', keepAlive: false, permission: ['/system/apps/basic'] }
              },
              {
                path: '/system/apps/versions',
                component: () => import(/* webpackChunkName: "system" */ '@/views/system/apps/versions/Index.vue'),
                meta: { title: 'App版本', keepAlive: false, permission: ['/system/apps/versions'] }
              },
              {
                path: '/system/apps/update',
                component: () => import(/* webpackChunkName: "system" */ '@/views/system/apps/Update'),
                meta: { title: '更新设置', keepAlive: false, permission: ['/system/apps/update'] }
              },
              {
                path: '/system/apps/banner',
                component: () => import(/* webpackChunkName: "system" */ '@/views/system/apps/banner/Index.vue'),
                meta: { title: '轮播设置', keepAlive: false, permission: ['/system/apps/banner'] }
              },
              {
                path: '/system/apps/notice',
                component: () => import(/* webpackChunkName: "system" */ '@/views/system/apps/notice/Index.vue'),
                meta: { title: '公告设置', keepAlive: false, permission: ['/system/apps/notice'] }
              },
              {
                path: '/system/apps/menu',
                component: () => import(/* webpackChunkName: "system" */ '@/views/system/apps/menu/Index.vue'),
                meta: { title: '菜单设置', keepAlive: false, permission: ['/system/apps/menu'] }
              },
              {
                path: '/system/apps/sms',
                component: () => import(/* webpackChunkName: "system" */ '@/views/system/apps/SMS'),
                meta: { title: '短信接口配置', keepAlive: false, permission: ['/system/apps/sms'] }
              },
              {
                path: '/store/setting',
                component: () => import(/* webpackChunkName: "store" */ '@/views/store/Setting'),
                meta: { title: '后台站点设置', keepAlive: false, permission: ['/store/setting'] }
              }
            ]
          },
          {
            path: '/system/commission',
            component: () => import(/* webpackChunkName: "setting" */ '@/views/system/Commission'),
            meta: { title: '佣金设置', keepAlive: false, permission: ['/system/commission'] }
          },
          {
            path: '/system/receive',
            component: () => import(/* webpackChunkName: "setting" */ '@/views/system/Receive'),
            meta: { title: '分红设置', keepAlive: false, permission: ['/system/receive'] }
          },
          {
            path: '/system/customer',
            component: () => import(/* webpackChunkName: "setting" */ '@/views/system/customer/Index.vue'),
            meta: { title: '客服设置', keepAlive: false, permission: ['/system/customer'] }
          },
          {
            path: '/system/apps/rate',
            component: () => import(/* webpackChunkName: "system" */ '@/views/system/apps/rate'),
            meta: { title: '抽奖规则设置', keepAlive: false, permission: ['/system/apps/rate'] }
          },
          {
            path: '/system/apps/reg',
            component: () => import(/* webpackChunkName: "system" */ '@/views/system/apps/reg'),
            meta: { title: '注册赠送规则', keepAlive: false, permission: ['/system/apps/reg'] }
          },
          {
            path: '/system/apps/laxin',
            component: () => import(/* webpackChunkName: "system" */ '@/views/system/apps/laxin'),
            meta: { title: '拉新奖励规则', keepAlive: false, permission: ['/system/apps/laxin'] }
          },
          {
            path: '/system/apps/redpack',
            component: () => import(/* webpackChunkName: "system" */ '@/views/system/apps/redpack'),
            meta: { title: '红包设置', keepAlive: false, permission: ['/system/apps/redpack'] }
          },
          {
            path: '/system/recharge',
            redirect: '/system/recharge/money',
            component: RouteView,
            meta: { title: '充值设置', keepAlive: false, permission: ['/system/recharge'] },
            children: [
              {
                path: '/system/recharge/money',
                component: () => import(/* webpackChunkName: "system" */ '@/views/system/recharge/money/Index.vue'),
                meta: { title: '充值金额设置', keepAlive: false, permission: ['/system/recharge/money'] }
              }
            ]
          },
          {
            path: '/system/withdraw',
            redirect: '/system/withdraw/cash',
            component: RouteView,
            meta: { title: '提现设置', keepAlive: false, permission: ['/system/withdraw'] },
            children: [
              {
                path: '/system/withdraw/cash',
                component: () => import(/* webpackChunkName: "system" */ '@/views/system/withdraw/Cash'),
                meta: { title: '现金提现设置', keepAlive: false, permission: ['/system/withdraw/cash'] }
              },
              {
                path: '/system/withdraw/usdt',
                component: () => import(/* webpackChunkName: "system" */ '@/views/system/withdraw/USDT'),
                meta: { title: 'USDT提现设置', keepAlive: false, permission: ['/system/withdraw/usdt'] }
              }
            ]
          },
          {
            path: '/setting/other',
            component: RouteView,
            redirect: '/setting/other/clear',
            meta: { title: '其他设置', keepAlive: false, permission: ['/setting/other'] },
            children: [
              {
                path: '/setting/other/clear',
                component: () => import(/* webpackChunkName: "content" */ '@/views/setting/other/Clear'),
                meta: { title: '清理缓存', keepAlive: false, permission: ['/setting/other/clear'] }
              }
            ]
          }
        ]
      },
      // 国际化配置
      {
        path: '/globalization',
        name: 'language',
        component: RouteView,
        redirect: '/globalization/language',
        meta: { title: '国际化配置', icon: Icons.setting, permission: ['/globalization'] },
        children: [
          {
            path: '/globalization/language',
            component: () => import(/* webpackChunkName: "globalization" */ '@/views/globalization/language/Index.vue'),
            meta: { title: '语言配置', keepAlive: false, permission: ['/globalization/language'] }
          },
          {
            path: '/globalization/code',
            component: () => import(/* webpackChunkName: "globalization" */ '@/views/globalization/code/Index.vue'),
            meta: { title: '国际区号', keepAlive: false, permission: ['/globalization/code'] }
          },
          {
            path: '/globalization/rate',
            component: () => import(/* webpackChunkName: "globalization" */ '@/views/globalization/rate/Index.vue'),
            meta: { title: '汇率管理', keepAlive: false, permission: ['/globalization/rate'] }
          }
        ]
      }
    ]
  },

  // 更新账户信息
  {
    name: 'renew',
    path: '/manage',
    redirect: '/manage/renew',
    component: BasicLayout,
    hidden: true,
    meta: { title: '更新账户信息', keepAlive: false },
    children: [
      {
        path: 'renew',
        component: () => import(/* webpackChunkName: "manage" */ '@/views/manage/renew')
      }
    ]
  },

  {
    path: '*', redirect: '/404', hidden: true
  }

]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [

  // 用户登录页
  {
    path: '/passport',
    component: UserLayout,
    redirect: '/passport/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "passport" */ '@/views/passport/Login')
      }
    ]
  },

  // 404页
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "exception" */ '@/views/exception/404')
  }

]
