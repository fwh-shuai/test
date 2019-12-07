<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{ flightsData.info.departCity }} - {{ flightsData.info.destCity }}
        /
        {{ flightsData.info.departDate }}
      </el-col>
      <el-col :span="4">
        <!-- 显示的值是label,值是value -->
        <el-select v-model="airport" @change="runFilters" size="mini" placeholder="起飞机场">
          <el-option
            v-for="(item, index) in flightsData.options.airport"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="flightTimes" @change="runFilters" size="mini" placeholder="起飞时间">
          <el-option
            v-for="(item, index) in flightsData.options.flightTimes"
            :key="index"
            :label="`${item.from}:00 - ${item.to}:00`"
            :value="`${item.from},${item.to}`"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="company" @change="runFilters" size="mini" placeholder="航空公司">
          <el-option
            v-for="(item, index) in flightsData.options.company"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="airSize" @change="runFilters" size="mini" placeholder="机型">
          <el-option
            v-for="(item,index) in sizeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button @click="handleFiltersCancel" type="primary" round plain size="mini">
        撤销
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['flightsData'],
  data () {
    return {
      airport: '', // 机场
      flightTimes: '', // 出发时间
      company: '', // 航空公司
      airSize: '', // 机型大小
      sizeOptions: [
        //   每一个对象都是一个尺寸,包括了 label 跟 value
        { label: '大', value: 'L' },
        { label: '中', value: 'M' },
        { label: '小', value: 'S' }
      ]
    }
  },
  methods: {
    // 全部过滤器都放一起，各项一起筛选
    runFilters () {
      let newFlightsList = this.flightsData.flights
      // 如果airport不为空,只有选中下拉列表时才不为空，下面以此类推
      if (this.airport) {
        newFlightsList = this.handleAirport(newFlightsList)
      }
      if (this.flightTimes) {
        newFlightsList = this.handleFlightTimes(newFlightsList)
      }
      if (this.company) {
        newFlightsList = this.handleCompany(newFlightsList)
      }
      if (this.airSize) {
        newFlightsList = this.handleAirSize(newFlightsList)
      }
      //   将所有过滤器都放在一起做一遍, 每一次前一个过滤器过滤完的结果应该是后一个过滤器的数据输入
      // 最后才一次执行更新数据操作

      this.$emit('setFlightsData', newFlightsList)
    },
    // 选择机场时候触发
    handleAirport (oldFlightsList) {
      const newFlightsList = oldFlightsList.filter(
        element => element.org_airport_name === this.airport
      )
      // this.$emit('setFlightsData', newFlightsList)
      return newFlightsList
    },

    // 选择出发时间时候触发
    handleFlightTimes (oldFlightsList) {
      const newFlightsList = oldFlightsList.filter((element) => {
        // 先获取飞机起飞时间的小时数据
        const depTimeHour = +element.dep_time.split(':')[0]
        // console.log(depTimeHour);
        // this.flightTimes 是一个字符串 "6,12"
        // 先切割成一个数组
        const before = +this.flightTimes.split(',')[0]
        const after = +this.flightTimes.split(',')[1]
        // 数据量少的时候可以写死一个小范围进行测试
        // var before = 21;
        // var after = 22;
        return depTimeHour >= before && depTimeHour < after
      })
      // this.$emit('setFlightsData', newFlightsList)
      return newFlightsList
    },

    // 选择航空公司时候触发
    handleCompany (oldFlightsList) {
      const newFlightsList = oldFlightsList.filter(
        element => element.airline_name === this.company
      )
      // this.$emit('setFlightsData', newFlightsList)
      return newFlightsList
    },

    // 选择机型时候触发
    handleAirSize (oldFlightsList) {
      const newFlightsList = oldFlightsList.filter(
        element => element.plane_size === this.airSize
      )
      // this.$emit('setFlightsData', newFlightsList)
      return newFlightsList
    },

    // 撤销条件时候触发
    handleFiltersCancel () {
      // 1. 清楚所有的筛选器
      this.airport = '' // 机场
      this.flightTimes = '' // 出发时间
      this.company = '' // 航空公司
      this.airSize = '' // 机型大小
      // 先清空过滤器条件,然后子传父传回原始数据 比较笨不容易理解的方法
      // 直接执行runFilter 更加简单
      this.runFilters()
    }
  }
}
</script>

<style scoped lang="less">
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>
