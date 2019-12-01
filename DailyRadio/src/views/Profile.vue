<template>
    <div id="profile">
        <router-view
            v-on:reg-user="regUser"
            v-on:create-user="createUser"
        ></router-view>
    </div>
</template>

<script>
    import {
        accessToken,
        refreshTokens,
        refreshToken,
        resetTokens
    } from '../assets/js/userApi';

    export default {
        name: 'profile',
        components: {},
        methods: {
            createUser() {
                this.$router.push('/profile/');
            },
            regUser() {
                this.$router.push('/profile/reg');
            }
        }
    };
</script>

<style lang="scss">
    @import '../variables';
    #profile {
        background: $Thoroddsenjökull-3-hex;
        height: 100vh;
        color: $Thoroddsenjökull-4-hex;
        border-color: $Thoroddsenjökull-4-hex;
    }
</style>
