<template>
  <a-modal
    class="noborder"
    :title="title"
    width="90%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="handleCancel"
    @cancel="handleCancel"
    :footer='null'
  >
    <user-table ref="table" v-if="visible" :isChildern="true" :childernId="record.user_id" />
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import * as Api from '@/api/user/index'

export default {
  components: {
  },
  props: {
  },
  data () {
    return {
      // 对话框标题
      title: '当前用户图谱',
      // 标签布局属性
      labelCol: { span: 7 },
      // 输入框布局属性
      wrapperCol: { span: 13 },
      // modal(对话框)是否可见
      visible: false,
      // modal(对话框)确定按钮 loading
      confirmLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this),
      // 当前记录
      record: {},
      treeData: [],
      replaceFields: {
        title: 'mobile',
        key: 'user_id',
        children: 'children'
      }
    }
  },
  methods: {
    selectUser(item) {
      console.log('item', item[0])
    },
    // 显示对话框
    handle (record) {
      // 显示窗口
      this.visible = true
      // 当前记录
      this.record = record

      this.getChildLists()
    },

    getChildLists () {
      // console.log('this.record', this.record.child_num <= 0)
      // if (this.record.child_num <= 0) {
      //   return this.$message.error('该用户下没有用户图谱')
      // }
      Api.childList({ user_id: this.record.user_id }).then(res => {
        this.treeData = res.data
      })
    },

    /**
     * 关闭对话框事件
     */
    handleCancel () {
      this.visible = false
    },

    onLoadData (treeNode) {
      console.log(treeNode)
      console.log(this.treeData)
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        // setTimeout(() => {
        //   treeNode.dataRef.children = [
        //     { title: 'Child Node', key: `${treeNode.eventKey}-0` },
        //     { title: 'Child Node', key: `${treeNode.eventKey}-1` },
        //   ];
        //   this.treeData = [...this.treeData];
        //   resolve();
        // }, 1000);
      });
    },

  }
}
</script>
<style lang="less">
.ant-form-item {
  margin-bottom: 15px;
}
</style>
