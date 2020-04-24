<template>
  <div class="home-content">
    <div
      class="card"
      :style="{ paddingTop: isChecked ? '30px' : 0 }"
      v-for="(shop, ind) in shopList"
      :key="ind"
    >
      <van-checkbox
        v-if="isChecked"
        class="check"
        @click="clickChecked(ind)"
        v-model="shop.checked"
      ></van-checkbox>
      <van-cell class="black-bold" title="商品名称" :value="shop.YPMC" />
      <div class="cell-container">
        <van-cell class="red blue-block" title="规格" :value="shop.YPGG" />
      </div>
      <van-cell title="生产厂家" :value="shop.SCCJ" />
      <div class="cell-container">
        <van-cell class="red" title="入库数量" :value="shop.SL" />
        <van-cell class="red up-shelf" title="上架数量">
          <input
            type="text"
            :style="{ width: '100%' }"
            @blur="registerSl(shop, 'SJSL')"
            v-model="shop.SJSL"
            placeholder="请输入上架数量"
          />
        </van-cell>
      </div>

      <div class="cell-container">
        <van-cell class="red blue-block" title="产品批号" :value="shop.SCPH" />
        <van-cell
          title="有效期至"
          :value="shop.YXQZ ? shop.YXQZ.split('T')[0] : ''"
        />
      </div>
      <van-cell class="red red-block" title="货架位号" :value="shop.HWBH" />
      <van-cell title="批准文号" :value="shop.PZWH" />
      <van-cell
        v-if="shop.YPTM"
        :class="{ 'blue-block': shop.YPTM ? false : true }"
        title="商品条码"
        :value="shop.YPTM"
      />
      <div v-else class="input-tm">
        <div style="color:blue;font-weight:700">商品条码</div>
        <input
          type="text"
          v-model="shop.XTM"
          placeholder="请输入商品条码"
          style="text-align:right;"
        />
      </div>
      <div class="cell-container">
        <van-cell title="商品编码" :value="shop.YPBM" />
      </div>
      <van-cell title="供应商名称" :value="shop.DWMC" />
      <van-cell class="refuse" title="拒收数量">
        <input
          class="refuse-input"
          type="text"
          :style="{ width: '100%' }"
          @blur="registerSl(shop, 'JSSL')"
          v-model="shop.JSSL"
          placeholder="请输入拒收数量"
        />
      </van-cell>
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
    },
    isChecked: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    // 上架数量输入框的验证
    registerSl(shop, type) {
      console.log("shop", shop);
      let reg = /^[1-9]\d*$/g;
      if (reg.test(shop[type])) {
        if (shop[type] > shop.SL) {
          shop[type] = "";
          this.$toast.fail(
            `${type === "SJSL" ? "上架" : "拒收"}数量不能大于订单数量！`
          );
        }
      } else {
        shop[type] = "";
        this.$toast.fail("请输入正整数！");
      }
    },
    clickChecked(ind) {
      this.shopList.forEach((item, inds) => {
        if (inds !== ind) {
          item.checked = false;
        }
      });
    }
  },
  mounted() {
    console.log(this.shopList);
  }
};
</script>

<style lang="less" scoped>
.black-bold {
  color: #333;
  font-weight: 700;
  /deep/ .van-cell__title {
    color: #333 !important;
    font-weight: 700;
  }
}
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
    color: #66a3f6 !important;
    font-weight: 700;
  }
}
.input-tm {
  position: relative;
  padding: 5px 15px;
  line-height: 24px;
  display: flex;
  justify-content: space-between;
}
.input-tm::after {
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
.home-content /deep/ .van-cell__title {
  color: #969799;
}

.home-content /deep/ .van-cell__value {
  color: #323233;
}

.red /deep/ .van-cell__value {
  color: #ff656e;
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
  border-bottom: 0 solid #ebedf0;
}

.card /deep/ .van-cell:not(:last-child)::before {
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

.card .refuse /deep/ .van-cell__title {
  width: 10%;
  color: #333 !important;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.refuse-input {
  border: 1px solid #ebedf0;
  border-radius: 30px;
  padding: 5px 10px;
}

.card .up-shelf /deep/ .van-cell__title {
  width: 80%;
}

.card /deep/ .van-cell__title {
  flex: auto;
  width: 30%;
}
.card /deep/ .van-cell__value {
  flex: auto;
}
.home-content {
  padding: 5px 10px;
}
.card {
  width: 100%;
  position: relative;
  margin-bottom: 10px;
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
