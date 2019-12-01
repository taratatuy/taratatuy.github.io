<template>
    <div id="auth" class="container">
        <div class="row align-items-center text-center">
            <form class="auth-form col-12" action="" title="Авторизация">
                <h1 class="auth-form__title">Введите логин</h1>
                <input
                    class="auth-form__input"
                    placeholder="login"
                    v-model="login"
                    title="Введите логин"
                />
                <h1 class="auth-form__title">Введите пароль</h1>
                <input
                    class="auth-form__input"
                    placeholder="password"
                    type="password"
                    v-model="password"
                />
                <div class="col-12">
                    <div class="auth-form__btn" @click="authUser()">Войти</div>
                </div>
                <div class="col-12">
                    <div class="auth-form__btn" @click="regUser()">
                        Зарегистрироваться
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import { setTokens, resetTokens, accessToken } from '../assets/js/userApi';
    import axios from 'axios';
    export default {
        name: 'auth',
        data() {
            return {
                login: null,
                password: null,
                tokens: {
                    accessToken: '',
                    refreshToken: ''
                }
            };
        },
        created() {
            if (accessToken != null) {
                this.$router.push('/profile/user/');
            }
        },
        methods: {
            regUser() {
                this.$emit('reg-user');
            },
            authUser() {
                axios({
                    method: 'post',
                    url: 'https://dailyradio-server.herokuapp.com/auth/login ',
                    auth: 'Bearer',
                    data: {
                        login: this.login,
                        password: this.password
                    }
                })
                    .then(res => {
                        this.$router.push('/profile/user');
                        this.tokens = res.data;
                        setTokens(
                            this.tokens.accessToken,
                            this.tokens.refreshToken
                        );
                    })
                    .catch(error => {});
            }
        }
    };
</script>

<style lang="scss">
    @import '../variables';
    #auth {
        padding-top: 80px;
        height: 100%;
    }
    .auth-form {
        &__title {
            font-size: 32px;
            padding: 10px 0;
        }

        &__input {
            border: 1px solid $Thoroddsenjökull-4-hex;
            color: $Thoroddsenjökull-1-hex;
            border-radius: 134px;
            width: 200px;
            background: $Thoroddsenjökull-2-hex;
            padding-left: 10px;
            height: 40px;
        }

        &__btn {
            cursor: pointer;
            width: 200px;
            height: 40px;
            border: 1px solid $Thoroddsenjökull-4-hex;
            color: $Thoroddsenjökull-4-hex;
            border-radius: 134px;
            margin: 20px auto;
            line-height: 2.2;
            &:hover {
                color: $Thoroddsenjökull-2-hex;
                border-color: $Thoroddsenjökull-2-hex;
            }
        }
    }
</style>
