<template>
  <div>
    <a-button @click="handleSelectGoods">选择产品</a-button>
    <a-table
      v-show="selectedItems.length"
      class="table-goodsList"
      rowKey="goods_id"
      :columns="columns"
      :dataSource="selectedItems"
      :pagination="false"
    >
      <!-- 商品信息 -->
      <template slot="item" slot-scope="item">
        <GoodsItem
          :data="{
            image: item.good_image ? item.good_image : item.images,
            imageAlt: '产品图片',
            title: item.goods_name,
            subtitle: `¥${item.goods_price}`
          }"
          :subTitleColor="true"
        />
      </template>
      <!-- 操作项 -->
      <span slot="action" slot-scope="text, item, index">
        <a  @click="handleDeleteItem(index)">删除</a>
      </span>
    </a-table>
    <GoodsModal
      ref="GoodsModal"
      :multiple="multiple"
      :maxNum="maxNum"
      :defaultList="selectedItems"
      @handleSubmit="handleSelectGoodsSubmit"
    />
  </div>
</template>

<script>
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import cloneDeep from 'lodash.clonedeep'
import { GoodsModal } from '@/components/Modal'
import { GoodsItem } from '@/components/Table'

const columns = [
  {
    title: '产品ID',
    dataIndex: 'goods_id'
  },
  {
    title: '产品信息',
    scopedSlots: { customRender: 'item' }
  },
  // {
  //   title: '库存总量',
  //   dataIndex: 'stock_total'
  // },
  // {
  //   title: '操作',
  //   width: '180px',
  //   dataIndex: 'action',
  //   scopedSlots: { customRender: 'action' }
  // }
]

// 商品选择器组件
export default {
  name: 'SelectGoods',
  components: {
    GoodsModal,
    GoodsItem
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // 多选模式, 如果false为单选
    multiple: PropTypes.bool.def(true),
    // 最大选择的数量限制, multiple模式下有效
    maxNum: PropTypes.integer.def(100),
    // 默认选中的商品
    defaultList: PropTypes.array.def([])
  },
  watch: {
    // 设置默认数据
    defaultList: {
      // 首次加载的时候执行函数
      immediate: true,
      deep: true,
      handler (val, newVal) {
        const { selectedItems } = this

        console.log(!selectedItems.length)

        if (val.length && !selectedItems.length) {
          this.onUpdate(cloneDeep(val))
        }

      }
    }
  },
  data () {
    return {
      columns,
      // 已选择的商品列表
      selectedItems: [],
      // 已选择的商品ID集
      selectedGoodsIds: []
    }
  },
  created () {
  },
  methods: {

    // 更新数据
    onUpdate (selectedItems) {
      if (this.multiple || !selectedItems.length) {
        // 多选模式
        this.selectedItems = selectedItems
        this.selectedGoodsIds = selectedItems.map(item => item.goods_id)
      } else {
        // 单选模式
        const single = selectedItems[selectedItems.length - 1]
        this.selectedItems = [single]
        this.selectedGoodsIds = [single.goods_id]
      }
      this.onChange()
    },

    // 打开商品选择器
    handleSelectGoods () {
      this.$refs.GoodsModal.handle()
    },

    // 商品库modal确认回调
    handleSelectGoodsSubmit (result) {
      console.log('result', result)
      const { selectedItems } = result
      this.onUpdate(cloneDeep(selectedItems))
    },

    // 删除商品
    handleDeleteItem (index) {
      const { selectedItems } = this
      selectedItems.splice(index, 1)
      this.onUpdate(selectedItems)
    },

    // 触发change事件
    onChange () {
      const { multiple, selectedGoodsIds } = this
      const sGoodsIds = multiple ? selectedGoodsIds : (selectedGoodsIds.length ? selectedGoodsIds[0] : undefined)
      return this.$emit('change', sGoodsIds)
    }

  }
}
</script>

<style lang="less" scoped>
// 商品信息
.table-goodsList {
  margin-top: 10px;
  min-width: 620px;
}
</style>
