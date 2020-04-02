<template>
  <div>
    <van-popup
      v-model="messageInfo.isShow"
      @open="openPopup"
      closeable
      position="bottom"
      :style="{ height: '80%' }"
    >
      <div class="popup-content">
        <div class="header">
          header
        </div>
        <div class="content">
          <van-list
            v-model="loading"
            :immediate-check="false"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <shop-card :shopList="shopList"></shop-card>
          </van-list>
        </div>
        <div class="footer">footer</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import ShopCard from "./shop-card";
import { getHandleMessage } from "@/api";
export default {
  name: "message_list",
  props: {
    messageInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: {
    ShopCard
  },

  data() {
    return {
      loading: false,
      finished: false,
      page: 1,
      shopList: [
        {
          px: "1",
          YPBM: "100137",
          YPMC: "氨溴特罗口服溶液(易坦静)",
          YPGG: "120ml",
          JLDW: "盒",
          JXMC: "溶液剂",
          PZWH: "国药准字H20040317",
          RQ: "2020-03-26T11:59:34.000Z",
          SCCJ: "北京韩美药品有限公司",
          SCPH: "19030004",
          SCRQ: "2019-03-06T00:00:00.000Z",
          SL: 1,
          YPBM: "100137",
          YPGG: "120ml",
          YPLX: "处方药",
          YPMC: "氨溴特罗口服溶液(易坦静)",
          YPTM: "6932721511234",
          YXQX: 1095,
          YXQZ: "2022-03-05T00:00:00.000Z"
        },
        {
          px: "1",
          YPBM: "100137",
          YPMC: "氨溴特罗口服溶液(易坦静)",
          YPGG: "120ml",
          JLDW: "盒",
          JXMC: "溶液剂",
          PZWH: "国药准字H20040317",
          RQ: "2020-03-26T11:59:34.000Z",
          SCCJ: "北京韩美药品有限公司",
          SCPH: "19030004",
          SCRQ: "2019-03-06T00:00:00.000Z",
          SL: 1,
          YPBM: "100137",
          YPGG: "120ml",
          YPLX: "处方药",
          YPMC: "氨溴特罗口服溶液(易坦静)",
          YPTM: "6932721511234",
          YXQX: 1095,
          YXQZ: "2022-03-05T00:00:00.000Z"
        },
        {
          px: "1",
          YPBM: "100137",
          YPMC: "氨溴特罗口服溶液(易坦静)",
          YPGG: "120ml",
          JLDW: "盒",
          JXMC: "溶液剂",
          PZWH: "国药准字H20040317",
          RQ: "2020-03-26T11:59:34.000Z",
          SCCJ: "北京韩美药品有限公司",
          SCPH: "19030004",
          SCRQ: "2019-03-06T00:00:00.000Z",
          SL: 1,
          YPBM: "100137",
          YPGG: "120ml",
          YPLX: "处方药",
          YPMC: "氨溴特罗口服溶液(易坦静)",
          YPTM: "6932721511234",
          YXQX: 1095,
          YXQZ: "2022-03-05T00:00:00.000Z"
        }
      ]
    };
  },
  methods: {
    openPopup() {
      this.initShop();
    },
    initShop() {
      getHandleMessage({
        pageIndex: this.page,
        pageSize: 10
      }).then(res => {
        console.log(res);
        // this.loading = false;
        // this.shopList.push(...res.result);
        // if (res.result.length < 10) {
        //   this.finished = true;
        // }
      });
    },
    onLoad() {
      // this.reload();
      this.loading = true;
      this.page++;
      getHandleMessage({
        pageIndex: this.page,
        pageSize: 10
      }).then(res => {
        console.log(res);
        // this.loading = false;
        // this.shopList.push(...res.result);
        // if (res.result.length < 10) {
        //   this.finished = true;
        // }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.popup-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  .header {
    height: 40px;
    line-height: 40px;
    font-size: 20px;
  }
  .content {
    flex-grow: 1;
    overflow: auto;
  }
  .footer {
    height: 40px;
    line-height: 40px;
  }
}
</style>
