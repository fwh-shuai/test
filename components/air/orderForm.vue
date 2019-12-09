<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人</h2>
      <el-form class="member-info">
        <div v-for="(user, index) in users" :key="index" class="member-info-item">
          <el-form-item label="乘机人类型">
            <!-- 添加联系人还可以写成users[index].username,id可写成users[index].id -->
            <el-input v-model="user.username" placeholder="姓名" class="input-with-select">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1" />
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input v-model="user.id" placeholder="证件号码" class="input-with-select">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option :checked="true" label="身份证" value="1" />
              </el-select>
            </el-input>
          </el-form-item>

          <span @click="handleDeleteUser(index)" class="delete-user">-</span>
        </div>
      </el-form>

      <el-button @click="handleAddUsers" class="add-member" type="primary">
        添加乘机人
      </el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <el-checkbox-group v-model="insurances">
          <div v-for="(item, index) in data.insurances" :key="index" class="insurance-item">
            <!-- select option 当中
            label 是给用户看的
            value 给计算机看的
            checkbox-group 当中
            label 才是给计算机看的
            给用户看的文字可以直接卸载 checkbox 标签之间-->
            <el-checkbox
              :label="item.id"
              border
            >
              {{ item.type }}：￥{{ item.price }}/份×1 最高赔付{{ item.compensation }}
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="contactName" />
          </el-form-item>

          <el-form-item label="手机">
            <el-input v-model="contactPhone" placeholder="请输入手机号">
              <template slot="append">
                <el-button @click="handleSendCaptcha">
                  发送验证码
                </el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="captcha" />
          </el-form-item>
        </el-form>
        <el-button @click="handleSubmit" type="warning" class="submit">
          提交订单
        </el-button>
        <span v-show="false">{{ allPrice }}</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['data'],
  data () {
    return {
      users: [
        {
          username: '',
          id: ''
        }
      ],
      // 注意这个insurances只有被打钩选中了才有相应的数据，是和this.data.insurances不一样的
      insurances: [],
      contactName: '',
      contactPhone: '',
      captcha: ''
    }
  },
  computed: {
    allPrice () {
      let res = 0
      res += this.data.seat_infos.org_settle_price * this.users.length
      this.insurances.forEach((ele) => {
        // 注意element前不用this
        this.data.insurances.forEach((element) => {
          if (element.id === ele) {
            res += element.price * this.users.length
          }
        })
      })
      // 这里面会见厅所有引用过的数据,每次处罚计算出一个新的加个,
      // 往侧边栏传输, 其实是兄弟组件传递, 要使用父组件作为桥梁
      // 机场建设和燃油附加费
      res += this.data.airport_tax_audlet * this.users.length
      this.$emit('changeForm', {
        numUsers: this.users.length,
        allPrice: res
      })
      return res
    }
  },
  methods: {
    // 添加乘机人
    handleAddUsers () {
      this.users.push({
        name: '',
        id: ''
      })
    },

    // 移除乘机人
    handleDeleteUser (index) {
      this.users.splice(index, 1)
    },

    // 发送手机验证码
    handleSendCaptcha () {
      if (this.contactPhone === '') {
        // 可以加上各种手机号格式验证,错误弹窗
        return
      }
      this.$axios({
        url: 'captchas',
        method: 'post',
        data: {
          tel: this.contactPhone
        }
      }).then((res) => {
        // console.log(res)
        this.$confirm('模拟手机验证码为' + res.data.code, '提示', { confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning' })
      })
    },

    // 提交订单
    handleSubmit () {
      const orderData = {
        users: this.users,
        insurances: this.insurances,
        contactName: this.contactName,
        contactPhone: this.contactPhone,
        invoice: false,
        seat_xid: this.data.seat_infos.seat_xid,
        air: this.data.id,
        captcha: this.captcha
      }
      // console.log(orderData)
      const token = this.$store.state.user.userInfo.token
      if (!token) {
        this.$message({
          message: '请登录',
          type: 'error'
        })
        this.$router.push({
          path: '/user/login'
        })
        return
      }
      this.$axios({
        url: '/airorders',
        method: 'post',
        data: orderData,
        headers: {
          // 每次都要带bearer一种叫做 jwt 的标准,注意 Bearer 后面有空格哦,形式固定, 只有后面的那个 token 不固定
          Authorization: 'Bearer ' + token
        }
      }).then((res) => {
        // console.log(res)
      }).catch((err) => {
        const { message } = err.response.data
        // 警告提示
        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>
