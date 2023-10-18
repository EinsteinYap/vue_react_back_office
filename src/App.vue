ya<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'
import * as Api from '@/api/setting/store'

export default {
  data () {
    return {
    }
  },
  created () {
    // this.getDetail()
  },
  computed: {
    locale () {
      // 只是为了切换语言时，更新标题
      // const { title } = this.$route.meta
      // title && (setDocumentTitle(`${i18nRender(title)} - ${domTitle}`))

      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  },
  methods: {
    getDetail () {
      this.isLoading = true
      Api.detail('basic')
        .then(result => {
          localStorage.setItem('currency_short', JSON.parse(JSON.stringify(result.data.values)).currency_short)
          // 当前记录
          // this.record = result.data.values
          // this.record = { ...this.record, logo: result.data.data.logo }
          // // 设置默认值
          // this.setFieldsValue()
        })
        .finally(result => {
          this.isLoading = false
        })
    }
  }
}
</script>
