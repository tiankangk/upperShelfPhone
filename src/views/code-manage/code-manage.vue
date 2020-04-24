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
        <van-dropdown-menu
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
        </van-dropdown-menu>
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
      <home-content :shopList="shopList" :isChecked="false"></home-content>
    </van-list>
  </div>
</template>

<script>
import { getPhoneUpperShelfShop } from "@/api";
import HomeContent from "./home-content";
export default {
  name: "code_manange",
  components: {
    HomeContent
  },
  data() {
    return {
      searchVal: "",
      isStore: false,
      isCode: false,
      loading: false,
      finished: false,
      page: 1,
      shopList: []
    };
  },
  methods: {
    onSearch() {
      this.loading = true;
      window.scrollTo(0, 0);

      this.loading = false;
      let timer = setTimeout(() => {
        this.initData();
        clearTimeout(timer);
      }, 0);
    },
    onConfirm() {},
    handleFilterShop() {},
    onLoad() {
      // this.reload();

      this.loading = true;
      this.page++;
      getPhoneUpperShelfShop({
        searchVal: this.searchVal,
        page: this.page
      }).then(res => {
        this.loading = false;
        this.shopList.push(...res.result);
        this.shopList.forEach((item, ind) => {
          if (!item.hasOwnProperty("checked")) {
            this.$set(item, "XTM", "");
            this.$set(item, "SJSL", item.SL);
            this.$set(item, "JSSL", "");
            this.$set(item, "checked", false);
          }
        });
        if (res.result.length < 10) {
          this.finished = true;
        }
      });
    },
    initData() {
      this.page = 1;
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: "spinner",
        mask: true
      });
      getPhoneUpperShelfShop({
        searchVal: this.searchVal,
        page: this.page
      }).then(res => {
        if (res.result.length < 10) {
          this.finished = true;
        }
        this.shopList = res.result;
        this.$toast.clear();
        this.shopList.forEach((item, ind) => {
          this.$set(item, "XTM", "");
          this.$set(item, "SJSL", item.SL);
          this.$set(item, "JSSL", "");
          if (ind === 0) {
            this.$set(item, "checked", true);
          } else {
            this.$set(item, "checked", false);
          }
        });
        if (this.searchVal) {
          if (this.$refs.addShelf) {
            this.$refs.addShelf.focus();
          }
        } else {
          document.querySelector(".search-content input").focus();
        }
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
      padding: 0 10px;
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
