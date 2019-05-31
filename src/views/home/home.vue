<template>
    <div class="home">
        <div class="header-container">
            <div class="keep-height"></div>
            <div class="header-content">
                <div class="username">{{getUsername}}</div>
                <van-search
                    class="search-content"
                    v-model.trim="searchVal"
                    background="#1ee5f9"
                    placeholder="请输入编码/条码/名称/助记码"
                    show-action
                    autofocus
                    shape="round"
                    @search="onSearch"
                >
                    <div slot="action" @click="onSearch">搜索</div>
                </van-search>
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
        <div style="positin:relative;">
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
                    </div>
                     <div v-if="!isShow" style="background:#35c347;" class="shelf-container">
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
        </div>
    </div>
</template>

<script>
    import homeContent from "./components/homeContent";
    import { getPhoneUpperShelfShop, upperShelfShop,isUsedCarNum } from "@/api";
    import { mapGetters } from "vuex";
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
                carNum:'',
                page: 1,
                shopList: []
            };
        },
        computed: {
            ...mapGetters(["getUsername"]),
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
                    console.log("res", res);
                    this.shopList.push(...res.result);
                    this.shopList.forEach((item, ind) => {
                        if (!item.hasOwnProperty("checked")) {
                             this.$set(item, "XTM", '');
                              this.$set(item, "SJSL", item.SL);
                            this.$set(item, "checked", false);
                        }
                    });
                    console.log("length", res.result.length);
                    if (res.result.length < 10) {
                        this.finished = true;
                        console.log("zhixing ");
                    }
                });
            },
            onSearch() {
                this.loading = true;
                window.scrollTo(0, 0);
               
                this.loading = false;
                console.log(this.searchVal);
                let timer = setTimeout(()=>{
                      this.initData();
                      clearTimeout(timer);
                },0)
              
                
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
            // 检查拣货篮有没有被占用
            makeSureCart(){
                console.log(this.carNum);
                  let regCarNum = /^[A-Z]\d{3}$/g;
                if(regCarNum.test(this.carNum)){
                    isUsedCarNum({carNum:this.carNum}).then(res =>{
                          this.carNum = '';
                        if(res.success){
                             this.$toast.success("该拣货篮没有被占用");
                        } else {
                            this.$toast.fail("该拣货篮被占用");
                        }
                    });
                }else {
                      this.$toast.success("拣货篮格式不正确");
                      this.carNum = '';
                }
            },
            // 上架
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
                           let reg = /^\s*$/g || "";
                        if(reg.test(this.getChoosed()[0].SJSL)){
                             this.$toast.fail("上架数量不能为空！");
                        } else{
                        this.$dialog
                            .confirm({
                                title: "提示",
                                message: "确定上架吗"
                            })
                            .then(() => {
                                // on confirm
                                upperShelfShop({
                                    shopInfo: this.getChoosed()[0],
                                    username: this.getUsername
                                }).then(res => {
                                    console.log(res);
                                    if (res.success) {
                                        this.$toast.success("上架成功");
                                        this.inputHwbh = "";
                                        this.searchVal = "";
                                        this.onSearch();
                                        // this.reload();
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
                    console.log(res);
                    if (res.result.length < 10) {
                        this.finished = true;
                        console.log("zhixing ");
                    }
                    this.shopList = res.result;
                    this.$toast.clear();
                    this.shopList.forEach((item, ind) => {
                         this.$set(item, "XTM", '');
                          this.$set(item, "SJSL", item.SL);
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
        mounted() {
            this.initData();
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
        height: 54px;
    }
    .header-content {
        display: flex;
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
        background: #1ee5f9;
        color: #ec47d1;
        align-items: center;
        .username {
            width: 50px;
            text-align: center;
        }
        .search-content {
            flex-grow: 1;
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