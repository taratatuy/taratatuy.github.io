<template>
    <header class="header-menu" id="header">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 text-center">
                    <nav class="menu">
                        <ul class="menu__list">
                            <li class="menu__item">
                                <router-link
                                    @click="changeItem(1)"
                                    class="menu__link"
                                    to="/radio"
                                    >Радио</router-link
                                >
                            </li>
                            <li class="menu__item">
                                <router-link
                                    @click="changeItem(2)"
                                    class="menu__link"
                                    to="/favorites-list"
                                    >Плейлист</router-link
                                >
                            </li>
                            <li class="menu__item">
                                <router-link
                                    @click="changeItem(3)"
                                    class="menu__link"
                                    to="/profile/"
                                    >Профиль</router-link
                                >
                            </li>
                        </ul>
                        <div class="menu__mobile">
                            <div class="menu__mobile_btn">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <ul class="menu__mobile_list">
                                <li class="menu__mobile_item">
                                    <router-link
                                        @click="changeItem(1)"
                                        class="menu__mobile_link"
                                        to="/radio"
                                        >Радио</router-link
                                    >
                                </li>
                                <li class="menu__mobile_item">
                                    <router-link
                                        @click="changeItem(2)"
                                        class="menu__mobile_link"
                                        to="/favorites-list"
                                        >Плейлист</router-link
                                    >
                                </li>
                                <li class="menu__mobile_item">
                                    <router-link
                                        @click="changeItem(3)"
                                        class="menu__mobile_link"
                                        to="/profile"
                                        >Профиль</router-link
                                    >
                                </li>
                                <div class="menu__mobile_close_button">
                                    <img
                                        src="assets/img/close-mobile-menu.png"
                                        alt=""
                                    />
                                </div>
                            </ul>
                            <div class="menu__mobile_mask"></div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
    import $ from 'jquery';
    import { accessToken } from '../assets/js/userApi';
    export default {
        name: 'Header',
        data() {
            return {
                isActive1: true,
                isActive2: false,
                isActive3: false
            };
        },
        created() {
            this.$router.push('/radio');
        },
        methods: {
            changeItem(menuItem) {
                if (menuItem == 1) {
                    this.isActive1 = true;
                    this.isActive2 = false;
                    this.isActive3 = false;
                } else if (menuItem == 2) {
                    this.isActive1 = false;
                    this.isActive2 = true;
                    this.isActive3 = false;
                } else {
                    this.isActive1 = false;
                    this.isActive2 = false;
                    this.isActive3 = true;
                }
                $('.menu__mobile_mask').hide(200);
                $('.menu__mobile_list').hide(200);
            }
        }
    };

    $(() => {
        $('.menu__mobile_btn').click(() => {
            $('.menu__mobile_list').show(200);
        });

        $('.menu__mobile_close_button').click(() => {
            $('.menu__mobile_list').hide(200);
        });

        $('.menu__mobile_btn').click(() => {
            $('.menu__mobile_mask').show(200);
        });

        $('.menu__mobile_close_button').click(() => {
            $('.menu__mobile_mask').hide(200);
        });

        $('.menu__mobile_mask').click(() => {
            $('.menu__mobile_mask').hide(200);
            $('.menu__mobile_list').hide(200);
        });
    });

    $('.menu__mobile_list')
        .find('li')
        .on('click', menuItem => {
            this.$emit('change-item', menuItem);
            if (menuItem == 1) {
                this.isActive1 = true;
                this.isActive2 = false;
                this.isActive3 = false;
            } else if (menuItem == 2) {
                this.isActive1 = false;
                this.isActive2 = true;
                this.isActive3 = false;
            } else {
                this.isActive1 = false;
                this.isActive2 = false;
                this.isActive3 = true;
            }
        });
</script>

<style lang="scss">
    @import '../variables';
    .header-menu {
        position: fixed;
        background: $Thoroddsenjökull-1-hex;
        height: 60px;
        width: 100%;
        z-index: 20;
        box-shadow: 0px 3px 7px 5px rgba(0, 0, 0, 0.4);
    }

    .menu {
        &__list {
            display: flex;
            height: 60px;
            padding: 0px;
            margin: 0 auto;
            justify-content: space-between;
            align-items: center;
            list-style-type: none;
            @media only screen and (max-width: 767px) {
                display: none !important;
            }
        }

        &__link {
            text-transform: uppercase;
            font-size: 18px;
            font-weight: 700;
            color: $Thoroddsenjökull-5-hex;

            &:hover {
                color: $Thoroddsenjökull-3-hex;
                text-decoration: none;
                animation: buttons-hover 1s;
            }
        }

        &__mobile {
            position: fixed;
            top: 0;
            left: 0;
        }

        &__mobile_btn {
            position: absolute;
            cursor: pointer;
            top: 10px;
            left: 20px;
            display: none;
            background: $Thoroddsenjökull-4-hex;
            padding: 10px;

            @media only screen and (max-width: 767px) {
                display: block;
                border-radius: 7px;
            }
        }

        &__mobile_btn span {
            display: block;
            height: 3px;
            width: 33px;
            background: $Thoroddsenjökull-2-hex;
            border-radius: 10px;
            margin-bottom: 5px;
        }

        &__mobile_btn span:last-child {
            margin: 0;
        }

        &__mobile_link {
            display: block;
            margin-top: 20px;
            color: $Thoroddsenjökull-5-hex;
            font-size: 20px;

            &:hover {
                color: $Thoroddsenjökull-3-hex;
                text-decoration: none;
                animation: buttons-hover 1s;
            }
        }

        &__mobile &__mobile_list {
            list-style-type: none;
            display: none;
            background: #1f2222;
            height: 100vh;
            width: 300px;
            z-index: 2;
            position: relative;
            padding-top: 12px;
        }

        &__mobile_close_button {
            position: absolute;
            right: 5px;
            top: 2px;
            cursor: pointer;
            padding: 5px;
        }

        &__mobile_mask {
            position: fixed;
            width: 100vw;
            height: 100vh;
            z-index: 1;
            display: none;
            background: #000000b5;
            top: 0;
            left: 0;
        }

        &__mobile_mask {
            position: fixed;
            width: 100vw;
            height: 100vh;
            z-index: 1;
            display: none;
            background: #000000b5;
            top: 0;
            left: 0;
        }
    }

    .router-link-active {
        color: $Thoroddsenjökull-3-hex !important;
    }

    @media only screen and (max-width: 767px) {
        #header {
            z-index: 1;
            width: 100%;
            height: 60px;
            background-color: $Thoroddsenjökull-1-hex;
        }
    }
</style>
