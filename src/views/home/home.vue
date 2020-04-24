<template>
  <div class="home">
    <router-view class="content" />
    <van-tabbar
      :fixed="false"
      class="van-tabbar"
      z-index="100"
      placeholder
      route
    >
   
      <van-tabbar-item replace to="/up_shelf" icon="home-o">
        上架
      </van-tabbar-item>
      <van-tabbar-item replace to="/code_manage" icon="search">
        条码管理
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "home"
};
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .content {
    flex-grow: 1;
  }
  .van-tabbar {
    box-shadow: 0 0 6px 0 #f2f2f2;
  }
}
</style>
