<template>
  <div>
    <van-popup
      v-model="messageInfo.isShow"
      @open="openPopup"
      @close="closePopup"
      position="bottom"
      round
      :style="{ height: '90%' }"
    >
      <div class="popup-content">
        <div class="header">
          <span>消息处理</span>
          <van-icon
            :style="{ fontSize: '30px' }"
            @click="messageInfo.isShow = false"
            name="cross"
          />
        </div>
        <div class="content">
          <div v-if="loadingData" class="loadingData">
            <van-loading
              class="loading"
              type="spinner"
              vertical
              color="#1989fa"
            />
          </div>

          <van-list
            v-model="loading"
            :immediate-check="false"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <shop-card
              :shopList="shopList"
              @on-click="handleChoose"
            ></shop-card>
          </van-list>
        </div>
        <div class="footer">
          <van-field
            ref="shelfCode"
            class="shelf-input"
            @keyup.enter.native="handleMessage('normal')"
            v-model="shelfCode"
            placeholder="请扫描货架位号"
          />
          <span @click="handleMessage('abnormal')">无货</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import ShopCard from "./shop-card";
import { getHandleMessage, processMessage } from "@/api";
import { mapGetters } from "vuex";
export default {
  name: "message_list",
  props: {
    messageInfo: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: {
    ShopCard,
  },
  computed: {
    ...mapGetters(["getUserId", "getUserMc"]),
  },
  data() {
    return {
      loadingData: false,
      loading: false,
      finished: false,
      page: 1,
      pageSize: 3,
      shelfCode: "",
      chooseRow: {},
      shopList: [],
    };
  },
  methods: {
    processMessage(data) {
      processMessage(data).then((res) => {
        console.log(res);
        this.shelfCode = "";
        if (res.success && res.result) {
          this.$toast.success(res.message);
        } else {
          this.$toast.fail(res.message);
        }
        this.initShop();
      });
    },
    /**
     * @description 处理消息
     */
    handleMessage(type) {
      let row = this.chooseRow;
      let data = {
        id: row.id,
        processUserId: this.getUserId,
        processUserName: this.getUserMc,
        processedStatus: type === "normal" ? 200 : 300,
      };
      if (type === "normal") {
        if (this.shelfCode) {
          console.log(this.shelfCode, row.HWBH);
          if (this.shelfCode === row.HWBH) {
            this.processMessage(data);
          } else {
            this.$toast.fail("请扫描正确的货位编号");
          }
        } else {
          this.$toast.fail("请扫描货位编号");
        }
      } else {
        this.$dialog
          .confirm({
            title: "标题",
            message: "确定无货吗？",
          })
          .then(() => {
            this.processMessage(data);
          });
      }
    },
    /**
     * @description 选择要处理的消息
     */
    handleChoose(row) {
      this.chooseRow = row;
      this.$refs.shelfCode.focus();
    },
    /**
     * @description 关闭弹出框
     */
    closePopup() {
      this.chooseRow = {};
    },
    /**
     * @description 打开弹出框
     */
    openPopup() {
      this.initShop();
      this.$nextTick(() => {
        this.$refs.shelfCode.focus();
      });
    },
    /**
     * @description 格式化后台返回的信息
     */
    formatMessage(result) {
      return result.map((item) => {
        let obj = { ...JSON.parse(item.notificationContent) };
        obj.id = item.id;
        return obj;
      });
    },
    /**
     * @description 打开弹框时初始化消息
     */
    initShop() {
      this.page = 1;
      this.loadingData = true;
      getHandleMessage({
        pageIndex: this.page,
        pageSize: this.pageSize,
      }).then((res) => {
        console.log(res);
        this.loading = false;
        this.loadingData = false;
        if (res.success) {
          this.shopList = this.formatMessage(res.result.notifications);
          if (0 in this.shopList) {
            this.$set(this.shopList[0], "checked", true);
            this.chooseRow = this.shopList[0];
          }

          if (res.result.notifications.length < this.pageSize) {
            this.finished = true;
          }
        } else {
          this.shopList = [];
          this.finished = true;
        }
      });
    },
    /**
     * @description 滚动加载消息
     */
    onLoad() {
      this.loading = true;
      this.page++;
      getHandleMessage({
        pageIndex: this.page,
        pageSize: this.pageSize,
      }).then((res) => {
        console.log(res);
        this.loading = false;
        if (res.success) {
          this.shopList.push(...this.formatMessage(res.result.notifications));
          if (res.result.notifications.length < this.pageSize) {
            this.finished = true;
          }
        } else {
          this.finished = true;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.popup-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  .header {
    // height: 80px;
    // line-height: 60px;
    padding: 10px;
    font-size: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 10px 10px 20px;
    border-bottom: 1px solid lightgrey;
  }
  .content {
    flex-grow: 1;
    overflow: auto;
    position: relative;
    .loadingData {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      z-index: 99;
      background: rgba(0, 0, 0, 0);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .footer {
    background-color: #1ee5f9;
    border-top: 1px solid lightgrey;
    padding: 5px 0;
    // height:80px;
    display: flex;
    justify-content: center;
    align-items: center;
    .shelf-input {
      text-align: center;
      border-radius: 4px;
      width: 70%;
      margin: 0 10px;
    }
  }
}
</style>
