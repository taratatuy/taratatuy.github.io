<template>
    <div id="app">
        <Header />
        <div id="loader">
            <div class="sk-double-bounce">
                <div class="sk-child sk-double-bounce-1"></div>
                <div class="sk-child sk-double-bounce-2"></div>
            </div>
        </div>
        <router-view />
        <player />
    </div>
</template>

<script>
    import Header from './components/Header.vue';
    import Player from './views/Player.vue';
    export default {
        name: 'app',
        data() {
            return {
                flg: false
            };
        },
        components: {
            Header,
            Player
        }
    };
</script>

<style lang="scss">
    @import './variables';
    body {
        background: $Thoroddsenjökull-2-hex !important;
    }
    input {
        outline: none;
    }
</style>
