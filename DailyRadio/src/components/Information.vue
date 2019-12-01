<template>
    <div id="information" class="information_body">
        <div class="container">
            <div class="information">
                <div
                    class="row information_height text-center justify-content-center align-items-center"
                >
                    <div class="row container">
                        <div
                            class="col-sm-12 offset-lg-4 col-lg-4 pb-2 pt-2 pt-md-3 pb-md-3"
                        >
                            <div
                                class="information__img"
                                id="track-image-container"
                            >
                                <img id="track-image" />
                                <div class="information__btn">
                                    <font-awesome-icon
                                        @click="addTrack()"
                                        icon="thumbs-up"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="col-12 pb-2 pt-2 pt-md-3 pb-md-3">
                            <h3 class="information__title" id="track-name"></h3>
                        </div>
                        <div class="col-12">
                            <!-- <div
                                class="information__numeric row justify-content-center pt-2"
                            >
                                <div
                                    class="col-3 information__numeric_currentTime"
                                ></div>
                                <div
                                    class="col-3 information__numeric_songLength"
                                ></div>
                            </div> -->
                            <input
                                disabled
                                class="information__currentTime"
                                id="current-time"
                                type="range"
                                name="points"
                                step="1"
                                min="0"
                                value="0"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { accessToken, refreshTokens } from '../assets/js/userApi';
    import { myAudio, getSongName, getThisSong } from '../assets/js/Audio';
    import { UpdateTrackInfo } from '../views/Player';
    import $ from 'jquery';
    import Axios from 'axios';
    export default {
        name: 'Information',
        data() {
            return {
                title: '',
                artist: '',
                picture: ''
            };
        },
        created() {
            var thisSong = getThisSong();
            $('#loader').css('display', 'block');
            $('#loader').css('opacity', '1 !important');
            setTimeout(() => {
                this.loadPreload();
                thisSong = getThisSong();
                this.UpdateTrackInfo();
            }, 750);
            $(myAudio).on('durationchange', () => {
                $('.information__numeric_songLength').html(
                    `${parseInt(myAudio.duration / 60)}:${this.PrettyTimeFormat(
                        parseInt(myAudio.duration % 60)
                    )}`
                );
            });

            let curtime;
            $(myAudio).on('timeupdate', () => {
                curtime = myAudio.currentTime;
                $('#current-time')
                    .attr('value', curtime)
                    .attr('max', myAudio.duration);
                $('.information__numeric_currentTime').html(
                    `${parseInt(
                        myAudio.currentTime / 60
                    )}:${this.PrettyTimeFormat(
                        parseInt(myAudio.currentTime % 60)
                    )}`
                );
            });
        },
        mounted() {},
        methods: {
            loadPreload() {
                $('#loader').css('display', 'none');
            },
            UpdateTrackInfo() {
                var thisSong = getThisSong();
                this.title = thisSong.title;
                this.artist = thisSong.artist;
                this.picture = thisSong.picture;
                this.title = this.title || 'Unknown title';
                this.artist = this.artist || 'Unknown artist';
                $('#track-name').html(this.title + ' - ' + this.artist);
                if (this.picture) {
                    $('#track-image').prop(
                        'src',
                        this._imageEncode(this.picture.data.data)
                    );
                } else {
                    $('#track-image').prop(
                        'src',
                        'https://i.imgur.com/1Y5Uhk6.png'
                    );
                }
            },
            PrettyTimeFormat(num) {
                return num < 10 ? `0${num}` : num;
            },
            _imageEncode(arrayBuffer) {
                let b64encoded = btoa(
                    [].reduce.call(
                        new Uint8Array(arrayBuffer),
                        (p, c) => {
                            return p + String.fromCharCode(c);
                        },
                        ''
                    )
                );
                let mimetype = 'image/jpeg';
                return 'data:' + mimetype + ';base64,' + b64encoded;
            },
            addTrack() {
                Axios({
                    method: 'post',
                    url:
                        'https://dailyradio-server.herokuapp.com/favorites/add',
                    headers: {
                        Authorization: 'Bearer ' + accessToken
                    },
                    data: {
                        song: getSongName()
                    }
                })
                    .then(res => {})
                    .catch(error => {
                        refreshTokens(this.addTrack());
                    });
            }
        }
    };
</script>

<style lang="scss">
    @import '../variables';
    $spinkit-size: 4em !default;
    $spinkit-spinner-color: #337ab7 !default;

    #loader {
        background: rgba(0, 0, 0, 0.98);
        -webkit-filter: blur(1px);
        filter: blur(1px);
        position: absolute;
        width: 100%;
        top: 59px;
        bottom: 59px;
        z-index: 999;
    }

    .sk-double-bounce {
        .sk-child {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: #337ab7;
            opacity: 0.6;
            position: absolute;
            bottom: 50%;
            right: 48%;
            animation: sk-double-bounce 2s infinite ease-in-out;
        }

        .sk-double-bounce-2 {
            animation-delay: -1s;
        }
    }

    @keyframes sk-double-bounce {
        0%,
        100% {
            transform: scale(0);
        }
        50% {
            transform: scale(1);
        }
    }

    .information_height {
        height: 100vh;
    }
    .information {
        color: #324034;
        &__logo {
            font-size: 28px;

            @media screen and (min-width: 768px) {
                font-size: 40px;
            }
        }

        &__img img {
            border: 1px solid #071726;
            height: 250px;
            width: auto;
            box-shadow: 2px 2px 10px 4px rgba(0, 0, 0, 0.3);
            @media screen and (min-width: 768px) {
                height: 300px;
            }
        }
        &__img:hover img {
            filter: blur(2px);
        }

        &__btn {
            cursor: pointer;
            transform: translate(-50%, -50%);
            color: #324034;
            font-size: 32px;
            position: absolute;
            left: 50%;
            top: 50%;
            &:hover {
                color: #4c5939;
                img {
                    filter: blur(1px);
                }
            }
        }

        &__title {
            height: 2em;
            margin: 0 auto;
            font-size: 16px;

            @media screen and (min-width: 768px) {
                font-size: 26px;
            }
        }

        &__numeric {
            font-size: 12px;

            @media screen and (min-height: 768px) {
                font-size: 24px;
            }
        }

        &__currentTime {
            outline: none;
            -webkit-appearance: none;
            background-color: #4c5939;
            width: 260px;
            height: 2px;
            border-radius: 15px;
        }
    }
</style>
