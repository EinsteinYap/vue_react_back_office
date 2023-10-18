<template>
  <div class="main">
    <div class="header">
      <div class="logo">
        <img src="~@/assets/logo.svg" class="logo" alt="logo" />
      </div>
      <p class="title">总后台系统登录</p>
    </div>
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <!-- 错误提示 -->
      <a-alert v-if="isLoginError" type="error" showIcon :message="loginErrorMsg" />
      <a-form-item>
        <a-input
          class="login-input"
          size="large"
          type="text"
          placeholder="请输入用户名"
          v-decorator="[
            'username',
            {rules: [{ required: true, message: '您还没有输入用户名' }], validateTrigger: 'change'}
          ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input
          class="login-input"
          size="large"
          type="password"
          autocomplete="false"
          placeholder="请输入用户密码"
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '您还没有输入用户密码' }], validateTrigger: 'blur'}
          ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input
          class="login-input"
          size="large"
          autocomplete="false"
          placeholder="请输入谷歌验证码,未绑定账户则不填"
          v-decorator="[
            'code',
            {rules: [{ required: false, message: '您还没有输入谷歌验证码' }], validateTrigger: 'blur'}
          ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >确定</a-button>
      </a-form-item>
    </a-form>
    <a-modal v-model="visible" width="300px" :destroyOnClose="true" :closable="false" :footer="null" :keyboard="false" :maskClosable="false" title="绑定谷歌验证码">
      <div class="qrcode-box">
        <img :src="qrcode.qrcode" />
        <a-input v-model="code" placeholder="请输入谷歌验证码" />
        <a-button :loading="codeloding" :disabled="!code" style="margin-top: 20px" @click="bdqrcode" type="primary">已扫码, 点击绑定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'

export default {
  data () {
    return {
      visible: false,
      // 是否登录错误
      isLoginError: false,
      // 登录错误的信息
      loginErrorMsg: '登录失败',
      // 表单组件
      form: this.$form.createForm(this),
      // 页面状态
      state: { loginBtn: false },
      qrcode: {},
      codeloding: false,
      code: ''
    }
  },
  created () { },
  methods: {
    ...mapActions(['Login']),
    // 绑定验证码
    bdqrcode() {
      const {
        form: { validateFields },
        state,
        Login
      } = this

      console.log(this.form.getFieldsValue())

      const loginParams = { ...this.form.getFieldsValue(), ...this.qrcode, code: this.code }


      console.log('loginParams', loginParams)
      this.codeloding = true
      Login(loginParams)
        .then(res => {
          console.log('res', res)
          if (res.status === 200) {
            this.loginSuccess(res)
          }
          // if (res.status === 405) {
          //   console.log('首次需要绑定二维码')
          //   app.qrcode = res.data
          //   app.visible = true
          // }
          // console.log('this.loginSuccess(res)', res)
          // this.loginSuccess(res)
        })
        .catch(err => {

        })
        .finally(() => {
          this.codeloding = false
        })
    },
    /**
     * 表单提交: 确定登录
     */
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login
      } = this
      const app = this;

      state.loginBtn = true

      // 表单验证
      validateFields(['username', 'password', 'code'], { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values }
          Login(loginParams)
            .then(res => {
              if (res.status === 405) {
                console.log('首次需要绑定二维码')
                console.log('123123123')
                app.qrcode = res.data
                app.visible = true
              } else {
                this.loginSuccess(res)
              }

              console.log('this.loginSuccess(res)', res)
              // this.loginSuccess(res)
            })
            .catch(err => this.loginFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 100)
        }
      })
    },

    /**
     * 登录成功
     */
    loginSuccess (res) {
      this.isLoginError = false
      // 显示提示信息
      this.$message.success(res.message, 1.5)
      setTimeout(() => {
        // 跳转到后台首页
        this.$router.push({ path: '/' })
        // 显示欢迎信息
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
    },

    /**
     * 登录请求失败
     */
    loginFailed (response) {
      this.isLoginError = true
      this.loginErrorMsg = response.message
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  margin-bottom: 40px;
  text-align: center;

  .logo {
    height: 50px;
    vertical-align: top;
    border-style: none;
    margin-bottom: 20px;
  }

  .title {
    font-size: 20px;
    color: #6c7293;
    font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
    position: relative;
    margin: 0;
  }
}

.user-layout-login {
  label {
    font-size: 14px;
  }

  /deep/.login-input .ant-input {
    border: none;
    background: rgba(235, 237, 242, 0.4);
    border-radius: 5px;
    font-size: 14px;
  }

  /deep/.ant-form-explain {
    margin-top: 5px;
    // color: rgba(245, 34, 45, 0.8);
    color: rgba(0, 0, 0, 0.45);
  }

  .login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
    margin-top: 20px;
    box-shadow: 0px 4px 16px 0px rgba(34, 185, 255, 0.15);
    &:hover {
      box-shadow: 0px 9px 16px 0px rgba(34, 185, 255, 0.25) !important;
    }
  }

  .ant-alert-error {
    margin-bottom: 24px;
    background-color: #fffbfb;
  }
}
.qrcode-box {
  padding: 20px;
  text-align: center;

  > img {
    margin-bottom: 10px;
  }
}
</style>
