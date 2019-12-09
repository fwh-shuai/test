<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightsFilters :flightsData="cacheFlightsData" @setFlightsData="setFlightsData" />

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <div>
          <FlightsItem :flight="item" v-for="(item, index) in dataList" :key="index" />
          <!-- total 是总数据量
          每页数据的长度应该是 page-size 属性-->
          <!-- 选择页数的时候触发的函数 current-change 函数可以接受到一个 val 值代表我们点击的页码 -->
          <el-pagination
            :total="flightsData.flights.length"
            :page-size="pageSize"
            :page-sizes="[2,5,10,20]"
            @current-change="changePageIndex"
            @size-change="sizeChange"
            v-if="dataList.length>0"
            layout="prev, pager, next,sizes"
          />
          <div v-else-if="!loading">
            本页暂无数据
          </div>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <FlightsAside />
      </div>
    </el-row>
  </section>
</template>

<script>
import FlightsListHead from '@/components/air/flightsListHead.vue'
import FlightsItem from '@/components/air/flightsItem.vue'
import FlightsFilters from '@/components/air/flightsFilters.vue'
import FlightsAside from '@/components/air/flightsAside.vue'

export default {

  components: {
    FlightsListHead,
    FlightsItem,
    FlightsFilters,
    FlightsAside
  },
  data () {
    return {
      loading: true,
      cacheFlightsData: {
        flights: [],
        info: {},
        options: {}
      },
      flightsData: {
        flights: [],
        info: {},
        options: {}
      }, // 航班总数据
      // dataList: [], // 航班列表数据，用于循环flightsItem组件，单独出来是因为要分页
      pageIndex: 1,
      pageSize: 8
    }
  },
  computed: {
    // 上面遍历循环组件时候就调用了dataList
    dataList () {
      const start = (this.pageIndex - 1) * this.pageSize // 0
      const end = start + this.pageSize // 10
      // 数组 slice 方法接受两个参数, 第一个是切割的开始(包括当前index), 第二个是切割的结束(不包过当前 index),
      return this.flightsData.flights.slice(start, end)
    }
  },
  watch: {
    // 这个函数用$route,因为要监听的刚好是$route里的东西
    $route () {
      console.log(this.$route.query.departCity)
      // 一般不建议强制刷新，用户体验不好
      //   location.reload()
      this.loadPageData()
    }
  },
  mounted () {
    // console.log(this.$route.query);
    // 对于路由,两种参数分别是 params 和 query
    // 对于 axios 两种参数分别是 data 和 params
    this.loadPageData()
  },
  methods: {
    loadPageData () {
      this.$axios({
        url: '/airs',
        // 参数可以通过 this.$route.query
        // 这里面数据本来就是一个对象,所以无需自己拼接
        params: this.$route.query
      }).then((res) => {
        console.log(res)
        this.flightsData = res.data
        this.cacheFlightsData = { ...this.flightsData }
        // 这里是分页, 我们需要拿到数据的开始index 和结尾的 index
        // this.loadPage()
        this.loading = false// 这肯定会执行的，不管datalist是否大于0,不过要同时两个条件成立才会显示无数据，否则优先显示数据
      })
    },
    setFlightsData (newFlightsList) {
      // console.log('修改机票筛选参数被触发')
      // 接受到新的机票数据
      this.flightsData.flights = newFlightsList
    },
    sizeChange (pageSize) {
      this.pageSize = pageSize
      // this.loadPage()
    },
    changePageIndex (pageIndex) {
      this.pageIndex = pageIndex
      // this.loadPage()
    }
    // loadPage () {
    //   const start = (this.pageIndex - 1) * this.pageSize // 0
    //   const end = start + this.pageSize // 10

    //   // 数组 slice 方法接受两个参数, 第一个是切割的开始(包括当前index), 第二个是切割的结束(不包过当前 index),
    //   this.dataList = this.flightsData.flights.slice(start, end)
    // }
  }
}
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>
