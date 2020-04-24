<template>
  <div class="up-shelf">
    <div class="header-content">
      <div class="search-container">
        <div class="username">{{ getUserMc }}</div>
        <van-search
          class="search-content"
          v-model.trim="searchVal"
          background="#2adab5"
          placeholder="请输入编码/条码/名称/助记码"
          shape="round"
          @search="onSearch"
        >
          <div slot="left-icon">
            <van-icon size="20" name="search" />
          </div>
        </van-search>
      </div>
      <van-notice-bar
        class="notice-bar border-bottom"
        speed="30"
        delay="2"
        left-icon="volume-o"
        mode="link"
        background="#fff"
        @click="handleMessage"
      >
        {{ noticeContent }}
      </van-notice-bar>
    </div>

    <van-list
      class="van-list"
      v-model="loading"
      :immediate-check="false"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <home-content :shopList="shopList"></home-content>
    </van-list>

    <div class="footer-container">
      <transition name="fade">
        <div v-if="isShow" class="shelf-container">
          <van-field
            ref="addShelf"
            :style="{ background: '#2adab5' }"
            class="shelf-input"
            @keyup.enter.native="handleUpperShelf"
            v-model="inputHwbh"
            placeholder="请扫描货位架"
          />
          <div class="refuse-btn">
            <span @click="handleRefuse">拒收</span>
          </div>
        </div>
        <div v-if="!isShow" style="background: #fff;" class="shelf-container">
          <van-field
            :style="{ background: '#2adab5' }"
            class="shelf-input"
            ref="makeSureCart"
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

    <message-list :messageInfo="messageInfo"></message-list>
  </div>
</template>

<script>
import HomeContent from "./home-content";
import MessageList from "./message-list";
import * as signalR from "@microsoft/signalr";

import {
  getPhoneUpperShelfShop,
  upperShelfShop,
  isUsedCarNum,
  refuseUpshelfShop
} from "@/api";
import { mapGetters, mapState } from "vuex";
import { setLocal, getLocal, clearLocal } from "@/libs/utils";

export default {
  name: "up_shelf",
  components: {
    HomeContent,
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
      let dev = process.env.NODE_ENV === "development";
      let url = `http://mqs-api.${dev ? "tst." : ""}yaojushi.com${
        dev ? "" : ":9247"
      }/chatHub?uid=${this.getUserId}&sid=1242103182866259901`;

      var connection = new signalR.HubConnectionBuilder().withUrl(url).build();
      //接受消息
      connection.on("ReceiveMessage", message => {
        let { YPMC } = JSON.parse(JSON.parse(message).content);
        this.noticeContent = `${YPMC}缺货，请及时上架`;
        this.broadcastNumber(this.noticeContent);
        setLocal("noticeContent", this.noticeContent);
      });
      connection
        .start()
        .then(function() {
          console.log("连接成功");
        })
        .catch(function(err) {
          return console.error(err.toString());
        });
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
    this.createWebSocket();
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
.up-shelf {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .van-list {
    overflow: auto;
    flex-grow: 1;
  }
}
.up-shelf /deep/ .van-cell {
  padding: 5px 15px;
}
.up-shelf /deep/ .van-cell .van-field__control {
  text-align: center;
}

.fade-leave-active {
  transition: all 0.5s;
}
.fade-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.header-content {
  width: 100%;
  position: relative;
  color: #fff;
  .search-container {
    display: flex;
    background: #2adab5;
    align-items: center;
  }
  .header-right {
    display: flex;
    align-items: center;
  }
  .username {
    width: 50px;
    font-size: 18px;
    text-align: center;
  }
  .search-btn {
    font-size: 20px;
  }
  .search-content {
    flex-grow: 1;
    /deep/ .van-icon-clear {
      font-size: 25px;
    }
  }
}

.footer-container {
  position: relative;
  width: 100%;
  z-index: 100;

  .shelf-container {
    width: 100%;
    padding: 10px;
    background: #fff;
    position: relative;
    .refuse-btn {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 25%;
      text-align: center;
      color: #2abad5;
    }
    .shelf-input {
      text-align: center;
      border-radius: 4px;
      width: 50%;
      margin: 0 auto;
      /deep/ input::-webkit-input-placeholder {
        color: #fff ;
      }
      /deep/ .van-field__control {
        color: #fff;
      }
    }
  }
}
</style>
