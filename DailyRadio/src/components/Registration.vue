<template>
    <div id="reg">
        <div class="container pt-5">
            <div class="row align-items-center text-center">
                <form class="auth-form col-12" action="" title="Регистрация">
                    <h1 class="auth-form__title">Введите логин</h1>
                    <input class="auth-form__input" placeholder="Your login" v-model="login" title="Введите логин">
                    <h1 class="auth-form__title">Введите пароль</h1>
                    <input class="auth-form__input" placeholder="Your password" v-model="password">
                    <h1 class="auth-form__title">Введите email</h1>
                    <input class="auth-form__input" placeholder="Your E-mail" v-model="email">
                    <div class="col-12">
                        <div class="auth-form__btn" @click="createUser()">Зарегистрироваться</div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'reg',
    data() {
        return {
            login: '',
            password: '',
            email: ''
        }
    },
    methods: {
        createUser() {
            axios({
                method: 'post',
                url: 'https://dailyradio-server.herokuapp.com/user/create',
                data: {
                    login: this.login,
                    password: this.password,
                    email: this.email
                }
            }).then(function (res) {
                if (res.status == '200') {
                    alert('Пользователь успешно зарегистрирован!');
                }
            });
            this.$emit('create-user', [this.login, this.password, this.email]);
        }
    }
}
</script>

<style lang="scss">
#reg {
    padding-top: 80px;
    height: 100%;  
}
</style>