<template>
  <div class="home">
    <div class="header-container">
      <div class="keep-height"></div>
      <div class="header-content">
        <div class="search-container">
          <div class="username">{{ getUsername }}</div>
          <van-search
            class="search-content"
            v-model.trim="searchVal"
            background="#1ee5f9"
            placeholder="请输入编码/条码/名称/助记码"
            show-action
            shape="round"
            @search="onSearch"
          >
            <div class="header-right" slot="action">
              <div @click="onSearch" style="margin-right: 15px;">搜索</div>
            </div>
          </van-search>
        </div>
        <van-notice-bar
          speed="30"
          delay="2"
          left-icon="volume-o"
          mode="link"
          @click="handleMessage"
        >
          {{ noticeContent }}
        </van-notice-bar>
      </div>
    </div>

    <van-list
      v-model="loading"
      :immediate-check="false"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <home-content :shopList="shopList"></home-content>
    </van-list>
    <div style="positin: relative;">
      <div class="keep-height"></div>
      <div class="footer-container">
        <transition name="fade">
          <div v-if="isShow" class="shelf-container">
            <van-field
              ref="addShelf"
              class="shelf-input"
              @keyup.enter.native="handleUpperShelf"
              v-model="inputHwbh"
              placeholder="请扫描货位架"
            />
            <span class="refuse-btn" @click="handleRefuse">拒收</span>
          </div>
          <div
            v-if="!isShow"
            style="background: #35c347;"
            class="shelf-container"
          >
            <van-field
              ref="makeSureCart"
              class="shelf-input"
              @keyup.enter.native="makeSureCart"
              v-model="carNum"
              placeholder="请扫描拣货篮"
            />
          </div>
        </transition>
      </div>
      <van-popup v-model="showPicker" position="bottom">
        <van-picker
          show-toolbar
          :loading="pickerLoading"
          :columns="columns"
          @cancel="showPicker = false"
          @confirm="onConfirmRefuse"
        />
      </van-popup>
    </div>

    <message-list :messageInfo="messageInfo"></message-list>
  </div>
</template>

<script>
import homeContent from "./components/homeContent";
import MessageList from "./message-list";
import {
  getPhoneUpperShelfShop,
  upperShelfShop,
  isUsedCarNum,
  refuseUpshelfShop
} from "@/api";
import { mapGetters, mapState } from "vuex";
import { setLocal, getLocal, clearLocal } from "@/libs/utils";

export default {
  name: "Home",
  components: {
    homeContent,
    MessageList
  },
  inject: ["reload"],
  data() {
    return {
      pickerLoading: false,
      messageInfo: {
        isShow: false
      },
      showPicker: false,
      columns: [
        "挤压破损",
        "效期不足一年",
        "来货与订单不符",
        "无计划",
        "来货批号错误",
        "来货规格不符",
        "来货厂家不同",
        "挤压变形",
        "近效期"
      ],
      //   noticeWidth: "0px",
      noticeContent: "暂无通知",
      loading: false,
      finished: false,
      searchVal: "",
      inputHwbh: "",
      carNum: "",
      page: 1,
      shopList: []
    };
  },
  computed: {
    ...mapGetters(["getUsername", "getUserId", "getUserMc"]),
    isShow() {
      if (this.shopList.length === 0) {
        return false;
      } else {
        let isChecked = this.shopList.filter(item => {
          return item.checked;
        });
        return isChecked.length === 0
          ? false
          : this.shopList.filter(item => {
              return item.checked;
            })[0].checked;
      }
    }
  },
  methods: {
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
    onSearch() {
      this.loading = true;
      window.scrollTo(0, 0);

      this.loading = false;
      let timer = setTimeout(() => {
        this.initData();
        clearTimeout(timer);
      }, 0);
    },
    trimVal(val) {
      return val.replace(/(^\s*)|(\s*$)/g, "").toUpperCase();
    },
    /**
     * 获得选中的值
     */
    getChoosed() {
      let chooseRow = this.shopList.filter(item => {
        return item.checked;
      });
      return 0 in chooseRow ? chooseRow[0] : {};
    },
    // 检查拣货篮有没有被占用
    makeSureCart() {
      let regCarNum = /^[A-Z]\d{3}$/g;
      if (regCarNum.test(this.carNum)) {
        isUsedCarNum({ carNum: this.carNum }).then(res => {
          this.carNum = "";
          if (res.success) {
            this.$toast.success("该拣货篮没有被占用");
          } else {
            this.$toast.fail("该拣货篮被占用");
          }
        });
      } else {
        this.$toast.success("拣货篮格式不正确");
        this.carNum = "";
      }
    },
    onConfirmRefuse(val) {
      console.log("val", val);
      let shopInfo = this.getChoosed();
      this.pickerLoading = true;
      refuseUpshelfShop({
        username: this.getUserMc,
        shopInfo,
        userId: this.getUserId,
        jsyy: val
      }).then(res => {
        if (res.code === 200) {
          this.$toast.success("拒收成功");

          this.showPicker = false;
          this.reload();
        } else {
          this.$toast.fail("拒收失败");
        }
        this.pickerLoading = false;
      });
    },
    // 拒收
    handleRefuse() {
      let chooseRow = this.getChoosed();
      console.log("chooseVal", chooseRow);
      let reg = /^\s*$/g || "";
      if (chooseRow.DJLX === "RKD") {
        if (reg.test(chooseRow.JSSL)) {
          this.$toast.fail("拒收数量不能为空！");
        } else {
          this.showPicker = true;
        }
      } else {
        this.$toast.fail("入库单才能拒收！");
      }
    },
    // 上架
    handleUpperShelf() {
      if (this.inputHwbh) {
        let chooseRow = this.getChoosed();
        if (
          this.trimVal(this.inputHwbh) ===
          this.trimVal(chooseRow.HWBH ? chooseRow.HWBH : "")
        ) {
          let reg = /^\s*$/g || "";
          if (reg.test(chooseRow.SJSL)) {
            this.$toast.fail("上架数量不能为空！");
          } else {
            this.$dialog
              .confirm({
                title: "提示",
                message: "确定上架吗"
              })
              .then(() => {
                // on confirm
                upperShelfShop({
                  shopInfo: chooseRow,
                  username: this.getUsername
                }).then(res => {
                  if (res.success) {
                    this.$toast.success("上架成功");
                    this.inputHwbh = "";
                    this.searchVal = "";
                    // this.onSearch();
                    this.reload();
                  } else {
                    this.$toast.fail("上架失败");
                  }
                });
              })
              .catch(() => {
                // on cancel
              });
          }
        } else {
          this.$toast.fail("请扫描正确的货位编号");
          this.inputHwbh = "";
        }
      } else {
        this.$toast.fail("内容不能为空");
      }
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
    },
    /**
     * @description 创建websocket
     */
    createWebSocket() {
      let url = "ws://ws.";
      if (process.env.NODE_ENV === "development") {
        url += `tst.`;
      }
      url += `yaojushi.com/connection?uid=${
        this.getUserId
      }&sid=1242103182866259901`;

      this.websocket = new WebSocket(url);
      this.websocket.onmessage = event => {
        console.log(event.data);
        let { YPMC } = JSON.parse(JSON.parse(event.data).content);
        this.noticeContent = `${YPMC}缺货，请及时上架`;
        this.broadcastNumber(this.noticeContent);
        setLocal("noticeContent", this.noticeContent);
      };
    },
    /**
     * @description 播报语音
     */
    broadcastNumber(words) {
      let url = `http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&pit=6&vol=15&per=4&text=${words}`;
      let n = new Audio(url);
      n.src = url;
      n.play();
    },
    /**
     * @description 处理消息
     */
    handleMessage() {
      this.$nextTick(() => {
        this.messageInfo.isShow = true;
        this.noticeContent = "暂无通知";
        clearLocal("noticeContent");
      });
    },
    setNoticeContent() {
      let localNotice = getLocal("noticeContent");
      this.noticeContent = localNotice ? localNotice : "暂无通知";
    }
  },
  created() {
    // this.createWebSocket();
  },
  mounted() {
    this.setNoticeContent();
    this.$nextTick(() => {
      document.querySelector(".header-content .van-field__control").focus();
    });
  }
};
</script>

<style lang="less" scoped>
.home /deep/ .van-cell {
  padding: 5px 15px;
}
.home /deep/ .van-cell .van-field__control {
  text-align: center;
}

.fade-leave-active {
  transition: all 0.5s;
}
.fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.header-container {
  position: relative;
  z-index: 100;
  .keep-height {
    height: 94px;
  }
  .header-content {
    width: 100%;
    position: fixed;
    left: 0;
    top: 0;

    color: #ec47d1;
    .search-container {
      display: flex;
      background: #1ee5f9;
      align-items: center;
    }
    .header-right {
      //   color: #fff;
      display: flex;
      align-items: center;
    }
    .username {
      width: 50px;
      text-align: center;
    }
    .search-btn {
      font-size: 20px;
      //   color: #fff;
    }
    .search-content {
      flex-grow: 1;
      /deep/ .van-icon-clear {
        font-size: 25px;
      }
    }
  }
}
.keep-height {
  height: 54px;
}
.footer-container {
  position: relative;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 100;

  .shelf-container {
    width: 100%;
    padding: 10px;
    background: #00d0ff;
    .refuse-btn {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
    .shelf-input {
      text-align: center;
      border-radius: 4px;
      width: 70%;
      margin: 0 auto;
    }
  }
}
</style>
