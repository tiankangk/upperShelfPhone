<template>
    <div>
        <div class="header-container">
            <div class="keep-height"></div>

            <van-search
                class="header-content"
                v-model.trim="searchVal"
                background="#1ee5f9"
                placeholder="请输入编码/条码/名称/助记码"
                show-action
                shape="round"
                @search="onSearch"
            >
                <div slot="action" @click="onSearch">搜索</div>
            </van-search>
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

        <div class="footer-container">
            <div class="keep-height"></div>
            <transition name="fade">
                <div v-if="isShow" class="shelf-container">
                    <van-field
                        class="shelf-input"
                        @keyup.enter.native="handleUpperShelf"
                        v-model="inputHwbh"
                        placeholder="请扫描货位架"
                    />
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    import homeContent from "./components/homeContent";
    import { getPhoneUpperShelfShop, upperShelfShop } from "@/api";
    export default {
        name: "Home",
        components: {
            homeContent
        },
        inject: ["reload"],
        data() {
            return {
                loading: false,
                finished: false,
                searchVal: "",
                inputHwbh: "",
                page: 1,
                shopList: []
            };
        },
        computed: {
            isShow() {
                console.log("shopList", this.shopList);
                if (this.shopList.length === 0) {
                    return false;
                } else {
                    // console.log(
                    //     this.shopList.filter(item => {
                    //         return item.checked;
                    //     })
                    // );
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
                    console.log(res);
                    this.shopList.push(...res.result);
                    this.shopList.forEach((item, ind) => {
                        if (!item.hasOwnProperty("checked")) {
                            this.$set(item, "checked", false);
                        }
                    });
                    if (res.result.length < 10) {
                        this.finished = true;
                    }
                });
            },
            getShopList() {},
            onSearch() {
                this.loading = true;
                window.scrollTo(0, 0);
                this.loading = false;
                console.log(this.searchVal);
                this.initData();
            },
            trimVal(val) {
                return val.replace(/(^\s*)|(\s*$)/g, "").toUpperCase();
            },
            /**
             * 获得选中的值
             */
            getChoosed() {
                console.log(this.shopList);
                console.log(
                    this.shopList.filter(item => {
                        return item.checked;
                    })
                );
                return this.shopList.filter(item => {
                    return item.checked;
                });
            },
            handleUpperShelf() {
                console.log(this.inputHwbh);
                // console.log(this.getChoosed()[0].HWBH);
                if (this.inputHwbh) {
                    if (
                        this.trimVal(this.inputHwbh) ===
                        this.trimVal(
                            this.getChoosed()[0] ? this.getChoosed()[0].HWBH : ""
                        )
                    ) {
                        this.$dialog
                            .confirm({
                                title: "提示",
                                message: "确定上架吗"
                            })
                            .then(() => {
                                // on confirm
                                upperShelfShop(this.getChoosed()[0]).then(res => {
                                    console.log(res);
                                    if (res.success) {
                                        this.$toast.success("上架成功");
                                        this.onSearch();
                                    } else {
                                        this.$toast.success("上架失败");
                                    }
                                });
                            })
                            .catch(() => {
                                // on cancel
                            });
                    } else {
                        this.$toast.fail("请扫面正确的货位编号");
                        this.inputHwbh;
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
                    console.log(res);

                    this.shopList = res.result;
                    this.$toast.clear();
                    this.shopList.forEach((item, ind) => {
                        if (ind === 0) {
                            this.$set(item, "checked", true);
                        } else {
                            this.$set(item, "checked", false);
                        }
                    });
                });
            }
        },
        mounted() {
            this.initData();
        }
    };
</script>

<style lang="less" scoped>
.fade-leave-active {
    transition: all 0.5s;
}
.fade-leave-to  {
    transform: translateY(100%);
     opacity: 0;
}
.header-container {
    position: relative;
    z-index: 100;
    .keep-height {
        height: 54px;
    }
    .header-content {
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
    }
}
.footer-container {
    position: relative;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    .keep-height {
        height: 64px;
    }
    .shelf-container {
        width: 100%;
        padding: 10px;
        background: #00d0ff;

        .shelf-input {
            text-align: center;
            border-radius: 4px;
            width: 70%;
            margin: 0 auto;
            // border:1px solid blue;
        }
    }
}
</style>