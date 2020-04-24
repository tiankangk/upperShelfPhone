<template>
  <div class="home-content">
    <div
      class="card"
      @click="clickChecked(ind, shop)"
      v-for="(shop, ind) in shopList"
      :key="ind"
    >
      <span v-if="shop.checked" class="icon-choosed iconfont icon-in_gouxuan"></span>
      <!-- <van-checkbox
        class="check"
        @click="clickChecked(ind)"
        v-model="shop.checked"
      ></van-checkbox> -->
      <van-cell title="商品名称" :value="shop.YPMC" />
      <div class="cell-container">
        <van-cell class="red red-block" title="规格" :value="shop.YPGG" />
        <van-cell class="red blue-block" title="产品批号" :value="shop.SCPH" />
      </div>
      <van-cell title="生产厂家" :value="shop.SCCJ" />
      <!-- <div class="cell-container">
        <van-cell title="剂量单位" :value="shop.JLDW" />
        <van-cell class="red" title="入库数量" :value="shop.SL" />
      </div> -->

      <!-- <div class="cell-container">
        <van-cell class="red blue-block" title="产品批号" :value="shop.SCPH" />
        <van-cell
          title="有效期至"
          :value="shop.YXQZ ? shop.YXQZ.split('T')[0] : ''"
        />
      </div> -->
      <van-cell class="red red-block" title="货架位号" :value="shop.HWBH" />
      <!-- <van-cell title="批准文号" :value="shop.PZWH" />
      <van-cell title="商品条码" :value="shop.YPTM" />

      <div class="cell-container">
        <van-cell title="储存条件" class="blod" :value="shop.CCTJ" />
        <van-cell title="处方分类" :value="shop.YPLX" />
      </div> -->
      <!-- <div class="cell-container">
        <van-cell title="商品编码" :value="shop.YPBM" />
        
      </div>
      <van-cell title="入库单号" :value="shop.ID" />
      <van-cell title="供应商名称" :value="shop.DWMC" /> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "homeContent",
  props: {
    shopList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      titleList: {
        // ID: "入库单号",
        // DWMC: "供应商名称",
        // YPBM: "商品编码",
        // YPTM: "商品条码",
        // YPMC: "商品名称",
        // YPGG: "规格",
        // JLDW: "计量单位",
        // JXMC: "剂型",
        // SCCJ: "生产厂家",
        // PZWH: "批准文号",
        // SL: "入库数量",
        // SCPH: "产品批号",
        // YXQZ: "有效期至",
        // HWBH: "货架位号"
        // CCTJ: "储存条件",
        // YPLX: "处方分类"
      }
    };
  },
  methods: {
    // 上架数量输入框的验证
    registerSl(shop) {
      console.log("shop", shop);
      let reg = /^[1-9]\d*$/g;
      if (reg.test(shop.SJSL)) {
        if (shop.SJSL > shop.SL) {
          shop.SJSL = "";
          this.$toast.fail("上架数量不能大于订单数量！");
        }
      } else {
        shop.SJSL = "";
        this.$toast.fail("请输入正整数！");
      }

      // console.log('val',e.target.value);
    },
    clickChecked(ind, row) {
      console.log("ind", ind);
      this.shopList.forEach((item, inds) => {
        this.$set(item, "checked", inds === ind);
        // if (inds !== ind) {

        //   item.checked = false;
        // } else {
        //     this.$set(item,'checked',true);
        //   item.checked = true;
        // }
      });
      this.$emit("on-click", row);
    }
  },
  mounted() {
    console.log(this.shopList);
  }
};
</script>

<style lang="less" scoped>
.red-block {
  color: red;
  font-weight: 700;
  /deep/ .van-cell__title {
    color: black !important;
    font-weight: 700;
  }
}
.blod {
  /deep/ .van-cell__value {
    font-weight: 700;
  }
}
.blue-block {
  color: blue;
  font-weight: 700;
  /deep/ .van-cell__title {
    color: black !important;
    font-weight: 700;
  }
  /deep/ .van-cell__value {
    color: blue !important;
    font-weight: 700;
  }
}
// .input-tm {
//   position: relative;
//   padding: 5px 15px;
//   line-height: 24px;
//   display: flex;
//   justify-content: space-between;
// }
// .input-tm::after {
//   content: " ";
//   position: absolute;
//   pointer-events: none;
//   -webkit-box-sizing: border-box;
//   box-sizing: border-box;
//   left: 15px;
//   right: 0;
//   bottom: 0;
//   -webkit-transform: scaleY(0.5);
//   transform: scaleY(0.5);
//   border-bottom: 1px solid #ebedf0;
// }
.home-content /deep/ .van-cell__title {
  color: #969799;
}

.home-content /deep/ .van-cell__value {
  color: #323233;
}

.red /deep/ .van-cell__value {
  color: red;
}
.card /deep/.van-checkbox__icon {
  height: 25px;
  line-height: 25px;
  /deep/ .van-icon {
    border: 1px solid #1989fa;
    font-size: 20px;
    width: 25px;
    height: 25px;
  }
}
.card /deep/ .van-cell {
  overflow: visible;
}
.card /deep/ .van-cell::after {
  content: " ";
  position: absolute;
  pointer-events: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  left: 15px;
  right: 0;
  bottom: 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  border-bottom: 1px solid #ebedf0;
}

.cell-container /deep/ .van-cell:not(:last-child)::before {
  content: " ";
  z-index: 49;
  position: absolute;
  pointer-events: none;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  height: 100%;
  width: 0;
  // left: 15px;
  right: -8px;
  top: 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  border-right: 1px solid #ebedf0;
}

.card /deep/ .van-cell__title {
  flex: auto;
  width: 37%;
}
.card /deep/ .van-cell__value {
  flex: auto;
}
.home-content {
  padding: 5px 10px;
}
.card {
  position: relative;
  padding:0 10px 10px 0;
//   &.active {
//     box-shadow: 0 0 4px 1px #0de0f5;
//   }
  .icon-choosed {
    position: absolute;
    right: 0;
    bottom: 0;
    color: red;
    font-size: 40px;
    z-index: 99;
  }
  //   padding-top: 30px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  border-color: #eee;
  width: 100%;
  position: relative;
  margin-bottom: 20px;
  .cell-container {
    display: flex;
  }
  .check {
    padding: 10px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }
  .cell {
    padding-left: 30px;
  }
}
</style>
