<template>
    <div class="login">
        <div class="logo-container">
            <img src="@/assets/logo.jpg" alt>
        </div>
        <div class="form-content">
            <van-cell-group>
                <van-field
                    @blur="validateUsername"
                    v-model.trim="formList.username"
                    :required="true"
                    clearable
                    label="用户名"
                    :error="usernameError"
                    placeholder="请输入用户名"
                />

                <van-field
                    @blur="validatePassword"
                    v-model.trim="formList.password"
                    type="password"
                    label="密码"
                    :error="passwordError"
                    placeholder="请输入密码"
                    :required="true"
                />
            </van-cell-group>
        </div>
        <van-button class="submit-btn" round size="large" @click="submitForm" type="info">登录</van-button>
    </div>
</template>

<script>
import {mapMutations} from 'vuex'
import {pickGoodsLogin} from '@/api'
    export default {
        name: "login",
        data() {
            return {
                formList: {
                    username: "",
                    password: ""
                },
                usernameError: false,
                passwordError: false,
                regEmp: /^\s*$/g || ""
            };
        },
        methods: {
            ...mapMutations(['setUserInfo']),
            validateUsername(e) {
               if (this.regEmp.test(this.formList.username)) {
                    this.formList.username = "";
                    this.usernameError = true;
                } 
            },
            validatePassword(e) {
               if (this.regEmp.test(this.formList.password)) {
                    this.formList.password = "";
                    this.passwordError = true;
                }
            },
            submitForm() {
                if (this.regEmp.test(this.formList.username)) {
                    this.formList.username = "";
                    this.usernameError = true;
                } else if (this.regEmp.test(this.formList.password)) {
                    this.formList.password = "";
                    this.passwordError = true;
                } else {
                   pickGoodsLogin(this.formList).then(res =>{
                       console.log(res);
                       if(res.success){
                           this.setUserInfo(res.result);
                           this.$router.push('/home');
                       } else {
                           this.$toast.fail('用户名或密码错误');
                       }
                   })
                }
            }
        }
    };
</script>

<style lang="less" scoped>
.login {
    position: absolute;
    left: 0;
    top: 10%;
    font-size: 20px;
    .logo-container {
        width: 50%;
        margin: 10px auto 20px auto;
        img {
            width: 100%;
        }
    }
    .form-content {
        padding: 0 15px;
    }
    .submit-btn {
        width: 90%;
        display: block;
        margin: 50px auto;
    }
}
</style>