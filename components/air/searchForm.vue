<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon" />{{ item.name }}
      </span>
    </el-row>

    <el-form ref="form" :model="form" class="search-form-content" label-width="80px">
      <el-form-item label="出发城市">
        <!-- fetch-suggestions 返回输入建议的方法 -->
        <!-- select 点击选中建议项时触发 -->
        <el-autocomplete
          v-model="form.departCity"
          :fetch-suggestions="getDartList"
          @select="selectDepartCity"
          placeholder="请搜索出发城市"
          class="el-autocomplete"
        />
      </el-form-item>
      <el-form-item label="到达城市">
        <el-autocomplete
          :fetch-suggestions="getDestList"
          v-model="form.destCity"
          @select="selectDestCity"
          placeholder="请搜索到达城市"
          class="el-autocomplete"
        />
      </el-form-item>
      <el-form-item label="出发时间">
        <!-- change 用户确认选择日期时触发 -->
        <el-date-picker
          v-model="form.departDate"
          @change="changeDate"
          type="date"
          placeholder="请选择日期"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item label="">
        <el-button
          @click="handleSubmit"
          style="width:100%;"
          type="primary"
          icon="el-icon-search"
        >
          搜索
        </el-button>
      </el-form-item>
      <div class="reverse">
        <span>换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      form: {
        departCity: '',
        destCity: '',
        departDate: '',
        departCode: '',
        destCode: ''
      },
      tabs: [
        { icon: 'iconfont icondancheng', name: '单程' },
        { icon: 'iconfont iconshuangxiang', name: '往返' }
      ],
      currentTab: 0
    }
  },
  mounted () {

  },
  methods: {
    // tab切换时触发
    handleSearchTab (item, index) {

    },

    // 出发城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    async  getDartList (value, cb) {
      const CityList = await this.searchCity(value)
      cb(CityList)
    },
    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    async  getDestList (value, cb) {
      const CityList = await this.searchCity(value)
      cb(CityList)
    },
    searchCity (value) {
      return this.$axios({
        url: '/airs/city',
        method: 'get',
        params: { name: this.form.destCity }
      }).then((res) => {
        // console.log(res)
        const { data } = res.data
        const citys = data.map((element) => {
          return { ...element, value: element.name }
        })
        return citys
        // console.log(citys)
      })
    },
    // 出发城市下拉选择时触发
    selectDepartCity (item) {
      // console.log(item)
      this.form.departCode = item.sort
    },
    // 目标城市下拉选择时触发
    selectDestCity (item) {
      this.form.destCode = item.sort
    },
    // 确认选择日期时触发
    changeDate () {
      this.form.departDate = moment(this.form.departDate).format('YYYY-MM-DD')
    },
    // 触发和目标城市切换时触发

    // 提交表单是触发
    handleSubmit () {
      console.log(this.form)
    }
  }
}
</script>

<style scoped lang="less">
.search-form{
    border:1px #ddd solid;
    border-top:none;
    width:360px;
    height:350px;
    box-sizing: border-box;
}

.search-tab{
  span{
    display: block;
    flex:1;
    text-align: center;
    height:48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top:3px #eee solid;
    background:#eee;
  }

  .active{
    border-top-color: orange;
    background:#fff;
  }

  i{
    margin-right:5px;
    font-size: 18px;

    &:first-child{
      font-size:16px;
    }
  }
}

.search-form-content{
  padding:15px 50px 15px 15px;
  position: relative;

  .el-autocomplete{
    width: 100%;
  }
}

.reverse{
  position:absolute;
  top: 35px;
  right:15px;

  &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:-35px;
      width:25px;
      height:1px;
      background:#ccc;
  }

  &:after{
      top:0;
    }

    &:before{
      top:60px;
    }

  span{
    display: block;
    position:absolute;
    top: 20px;
    right:0;
    font-size:12px;
    background: #999;
    color:#fff;
    width:20px;
    height:20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,&:before{
      display: block;
      content: "";
      position: absolute;
      left:10px;
      width:1px;
      height:20px;
      background:#ccc;
    }

    &:after{
      top:-20px;
    }

    &:before{
      top:20px;
    }
  }
}
</style>
