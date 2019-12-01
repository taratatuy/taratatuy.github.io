<template>
    <div id="user">
        <div class="container">
            <div class="user row text-center">
                <div class="col-12">
                    <router-link to="/profile"> 
                        <div class="user__btn user__btn-logout" @click="logOut();"> 
                            <p>Выйти</p>
                        </div>
                    </router-link>
                </div>
                <div class="col-12 pt-5">
                    <p>Ваш логин: {{ login }}</p>
                </div>
                <div class="col-12">
                    <p>Ваш email: {{ email }}</p>
                </div>
                <div class="col-12">
                    <div class="user__btn" id="show-modal" @click="showModal = true">
                        <p>Изменить пароль</p>
                    </div>
                    <NewPassword v-if="showModal" @close="showModal = false" v-on:change-pass="changePassword"/>
                    <div class="user__btn" id="show-modal" @click="showModal2 = true">
                        <p>Изменить почту</p>
                    </div>
                    <NewEmail v-if="showModal2" @close="showModal2 = false" v-on:change-email="changeEmail"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import NewPassword from '../components/NewPassword'
import NewEmail from '../components/NewEmail'
import axios from 'axios'
import {accessToken, refreshTokens, resetTokens} from '../assets/js/userApi'
import { newAddress } from '../main'
export default {
    name: 'user',
    components: {
        NewPassword,
        NewEmail
    },
    data() {
        return {
            login: '',
            email: '',
            verified: '',
            password: '',
            showModal: false,
            showModal2: false
        }
    },
    created() {
        this.getUser();
    },
    methods: {
        getUser() {
            axios({
            method: 'get',
            url: 'https://dailyradio-server.herokuapp.com/user/get',
            headers: {
                Authorization: 'Bearer ' + accessToken
            }
            }).then(res => {
                this.login = res.data.login;
                this.email = res.data.email;
                this.verified = res.data.verified;
            }).catch(error => {
                refreshTokens({func: this.getUser()});
            });
        },
        changePassword(password) {
            axios({
                method: 'post',
                url: 'https://dailyradio-server.herokuapp.com/user/changePassword',
                headers: {
                    Authorization: 'Bearer ' + accessToken
                },
                data: {
                    newPassword: password
                }
            }).then(res => {

            }).catch(error => {
                refreshTokens({func: this.changePassword(password)});
            });
        },
        changeEmail(email) {
            axios({
                method: 'post',
                url: 'https://dailyradio-server.herokuapp.com/user/changeEmail',
                headers: {
                    Authorization: 'Bearer ' + accessToken
                },
                data: {
                    newEmail: email
                }
            }).then(res => {

            }).catch(error => {
                refreshTokens({func: this.changeEmail(email)});
            });
        },
        logOut() {
            axios({
                method: 'get',
                url: 'https://dailyradio-server.herokuapp.com/auth/logout',
                headers: {
                    authorization: 'Bearer ' + accessToken 
                }
            }).then(res => {
                this.$router.push('/profile/');
                resetTokens();
                this.authorization = -1;
            }).catch(error => {
                refreshTokens({func: this.logOut()});
            });
        },
    }
}
</script>

<style lang="scss">
@import '../variables';
#user {
    padding-top: 80px;
    text-align: left;

}
.user {
    font-size: 32px;

    &__btn {
        width: 200px;
        height: 40px;
        border: 1px solid $Thoroddsenjökull-4-hex;
        border-radius: 134px;
        cursor: pointer;
        line-height: 2.2;
        font-size: 16px;
        color: $Thoroddsenjökull-4-hex;
        margin: 20px auto;

        &:hover {
            border-color: $Thoroddsenjökull-2-hex;
        }

        &:hover p{
            color: $Thoroddsenjökull-2-hex;
        }
    }

    &__btn-logout {
        width: 140px;
        margin: 0px;
        float: right;
    }
}

</style>