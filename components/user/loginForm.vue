<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    class="form"
  >
    <el-form-item class="form-item" prop="username">
      <el-input
        v-model="form.username"
        placeholder="用户名/手机"
      />
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input
        v-model="form.password"
        placeholder="密码"
        type="password"
      />
    </el-form-item>

    <p class="form-text">
      <nuxt-link to="#">
        忘记密码
      </nuxt-link>
    </p>

    <el-button
      @click="handleLoginSubmit()"
      class="submit"
      type="primary"
    >
      登录
    </el-button>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      // 表单数据
      form: {
        username: '',
        password: ''
      },
      // 表单规则
      rules: {
        username: [
          {
            required: true,
            message: '不能为空请输入姓名',
            trigger: 'blur'
          }],
        password: [{
          required: true,
          message: '密码不能为空',
          trigger: 'blur'
        }]

      }
    }
  },
  methods: {
    // 提交登录
    handleLoginSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$axios({
            url: '/accounts/login',
            method: 'POST',
            data: this.form

          }).then((res) => {
            console.log(res)
            this.$store.commit('user/setUserInfo', res.data)
          })
        } else {
          alert('输入不正确')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
    .form{
        padding:25px;
    }

    .form-item{
        margin-bottom:20px;
    }

    .form-text{
        font-size:12px;
        color:#409EFF;
        text-align: right;
        line-height: 1;
    }

    .submit{
        width:100%;
        margin-top:10px;
    }
</style>
