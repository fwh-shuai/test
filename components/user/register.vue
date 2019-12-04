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
        placeholder="用户名手机"
      />
    </el-form-item>

    <el-form-item class="form-item" prop="captcha">
      <el-input
        v-model="form.captcha"
        placeholder="验证码"
      >
        <template slot="append">
          <el-button @click="handleSendCaptcha">
            发送验证码
          </el-button>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="nickname">
      <el-input
        v-model="form.nickname"
        placeholder="你的名字"
      />
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input
        v-model="form.password"
        placeholder="密码"
        type="password"
      />
    </el-form-item>

    <el-form-item class="form-item" prop="checkPassword">
      <el-input
        v-model="form.checkPassword"
        placeholder="确认密码"
        type="password"
      />
    </el-form-item>

    <el-button
      @click="handleRegSubmit"
      class="submit"
      type="primary"
    >
      注册
    </el-button>
  </el-form>
</template>

<script>
export default {
  data () {
    // 确认密码,这个怎么来的啊
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      // 表单数据
      form: {
        username: '',
        nickname: '',
        captcha: '',
        password: '',
        checkPassword: ''
      },
      // 表单规则
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入用昵称', trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        checkPassword: [{ validator: validatePass, trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 发送验证码
    handleSendCaptcha () {
      if (!this.form.username) {
        this.$confirm('手机号码不能为空', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        })
        return
      }

      if (this.form.username.length !== 11) {
        this.$confirm('手机号码格式错误', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        })
        return
      }
      this.$axios({
        url: `captchas`,
        method: 'POST',
        data: {
          tel: this.form.username
        }
      }).then((res) => {
        console.log(res)
        const { code } = res.data
        this.$confirm(`模拟手机验证码为：${code}`, '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        })
      })
    },

    // 注册
    handleRegSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 注册提交
          const { checkPassword, ...props } = this.form

          this.$axios({
            url: `/accounts/register`,
            method: 'POST',
            data: props
          }).then((res) => {
            console.log(res.data)
          })
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
