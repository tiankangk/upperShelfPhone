<template>
  <div class="code-manage">
    <div class="header">
      <van-search
        class="search-content"
        v-model.trim="searchVal"
        background="#2adab5"
        placeholder="请输入编码/条码/名称/助记码"
        shape="round"
        show-action
        @search="onSearch"
      >
        <!-- <van-dropdown-menu
          class="drop-menu"
          z-index="99"
          :style="{ background: 'transparent' }"
          slot="action"
        >
          <van-dropdown-item
            :style="{ background: 'transparent' }"
            title="筛选"
            ref="item"
          >
            <van-switch-cell v-model="isStore" title="是否有库存" />
            <van-switch-cell v-model="isCode" title="是否有条码" />
            <van-button block color="#2adab5" @click="onConfirm"
              >确认</van-button
            >
          </van-dropdown-item>
        </van-dropdown-menu> -->
      </van-search>
    </div>
    <van-list
      class="van-list"
      v-model="loading"
      :immediate-check="false"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <home-content
        ref="vanList"
        :shopList="shopList"
        :isChecked="false"
        @saveCode="saveCode"
      ></home-content>
    </van-list>
  </div>
</template>

<script>
import { getNoCodeShop, saveCode } from "@/api";
import HomeContent from "./home-content";
import { mapGetters } from "vuex";
export default {
  name: "code_manange",
  components: {
    HomeContent
  },
  inject: ["reload"],
  data() {
    return {
      searchVal: "",
      isStore: false,
      isCode: false,
      loading: false,
      finished: false,
      pageIndex: 1,
      pageSize: 10,
      shopList: []
    };
  },
  computed: {
    ...mapGetters(["getUserId", "getUserMc"])
  },
  methods: {
    /**
     * @description 保存条码
     */
    saveCode(row) {
      //   let reg = /^[1-9]\d*$/g;
      //   if (reg.test(row.internationalBarCode)) {
      this.$dialog
        .confirm({
          title: "提示",
          message: "确定要修改条码吗"
        })
        .then(() => {
          let data = {
            userId: this.getUserId,
            userName: this.getUserMc,
            productId: row.productId,
            internationalBarCode: row.internationalBarCode
          };
          this.$toast.loading({
            duration: 0, // 持续展示 toast
            forbidClick: true, // 禁用背景点击
            loadingType: "spinner",
            mask: true
          });
          saveCode(data).then(res => {
            let {
              success,
              data: { result, message }
            } = res;
            if (success && result) {
              this.$toast.success(message);
            } else {
              this.$toast.fail(message);
            }
            let timer = setTimeout(() => {
              this.reload();
              clearTimeout(timer);
            }, 1000);
          });
        })
        .catch(() => {
          // on cancel
        });
      //   } else {
      //     this.$toast.fail("请输入正确的条码！");
      //   }
    },
    onSearch() {
      this.loading = true;
      window.scrollTo(0, 0);

      this.loading = false;
      let timer = setTimeout(() => {
        this.initData();
        clearTimeout(timer);
      }, 0);
    },
    onLoad() {
      this.loading = true;
      this.pageIndex++;
      getNoCodeShop({
        queryName: this.searchVal,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then(res => {
        this.loading = false;
        let {
          success,
          data: { isSuccess, infos, totalCount }
        } = res;
        this.shopList.push(...infos);
        this.shopList.forEach((item, ind) => {
          this.$set(item, "internationalBarCode", "");
        });
        this.getFocus();
        if (infos.length < 10) {
          this.finished = true;
        }
      });
    },
    getFocus() {
      this.$nextTick(() => {
        this.$refs.vanList.$refs.input0[0].focus();
      });
    },
    initData() {
      this.pageIndex = 1;
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: "spinner",
        mask: true
      });
      getNoCodeShop({
        queryName: this.searchVal,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then(res => {
        console.log("res", res);
        let {
          success,
          data: { isSuccess, infos, totalCount }
        } = res;
        if (success && isSuccess) {
          if (infos.length < 10) {
            this.finished = true;
          } else {
            this.finished = false;
          }
          this.shopList = infos;

          this.shopList.forEach((item, ind) => {
            this.$set(item, "internationalBarCode", "");
          });
          this.getFocus();
        } else {
          this.finished = true;
          this.shopList = [];
        }
        this.$toast.clear();
      });
    }
  },
  created() {
    this.initData();
  }
};
</script>

<style lang="less" scoped>
.code-manage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .header {
    .search-content {
      padding: 10px;
    }
    /deep/ .van-search__action {
      background: transparent;
    }
    /deep/ .van-dropdown-menu__title {
      color: #fff;
      background: transparent;
    }
    /deep/ .van-hairline--top-bottom::after {
      border-width: 0;
    }
    .drop-menu {
      /deep/ .van-cell {
        padding: 5px 10px;
      }
    }
  }
  .van-list {
    flex-grow: 1;
    overflow: auto;
  }
}
</style>
