<template>
    <div id="favorites">
        <div class="container">
            <div class="wrapper container-fluid">
                <div class="content d-flex">
                    <div v-if="!tracks[0]" class="no-songs container">
                        No favorite songs
                    </div>
                    <div v-if="tracks[0]" class="song-list container">
                        <div
                            class="song"
                            v-for="(track, index) in tracks"
                            :key="index"
                        >
                            <div @click="play(index)" class="row">
                                <div
                                    class="song-cover d-flex align-items-center justify-content-center"
                                >
                                    <img
                                        class="b-radius"
                                        :src="_imageEncode(track.picture.data)"
                                        alt="IMG"
                                        height="60px"
                                        width="60px"
                                    />
                                </div>
                                <div class="song-info col col-md row">
                                    <div
                                        class="info-title col-12 col-md-6 col-xl-4 d-flex align-items-center"
                                    >
                                        <span class="text-truncate">
                                            <b>{{ track.title }}</b>
                                        </span>
                                    </div>
                                    <div
                                        class="info-artist col-12 col-md-6 col-xl-4 d-flex align-items-center"
                                    >
                                        <span class="text-truncate">{{
                                            track.artist
                                        }}</span>
                                    </div>
                                    <div
                                        class="info-albom d-none col-xl-4 d-xl-flex align-items-center"
                                    >
                                        {{ track.album }}
                                    </div>
                                </div>
                                <div
                                    class="song-duration col-1 d-flex align-items-center justify-content-center"
                                >
                                    {{
                                        parseInt(track.duration / 60) +
                                            ':' +
                                            PrettyTimeFormat(
                                                parseInt(track.duration % 60)
                                            )
                                    }}
                                </div>
                                <div
                                    class="song-controls col-1 d-flex align-items-center justify-content-center"
                                    @click="hideTrack($event, track.fileName)"
                                >
                                    <font-awesome-icon
                                        class="delete-icon"
                                        icon="trash"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <player2
            v-on:next-track="nextTrack"
            v-on:prev-track="prevTrack"
        ></player2>
    </div>
</template>

<script>
    import {
        accessToken,
        refreshTokens,
        getTokens
    } from '../assets/js/userApi';
    import player2 from '../components/Player2';
    import { myAudio2, myAudio } from '../assets/js/Audio';
    import $ from 'jquery';
    import axios from 'axios';
    import { async } from 'q';
    export default {
        name: 'FavoritesList',
        components: {
            player2
        },
        data() {
            return {
                tracks: [],
                count: 0,
                active: true
            };
        },
        methods: {
            getTracks() {
                axios({
                    method: 'post',
                    url: 'https://dailyradio-server.herokuapp.com/favorites/',
                    headers: {
                        Authorization: 'Bearer ' + accessToken
                    }
                })
                    .then(res => {
                        this.tracks = res.data;
                    })
                    .catch(error => {
                        if (accessToken == '') {
                            alert('Пожалуйста авторизуйтесь!');
                        } else {
                            refreshTokens({ func: this.getTracks });
                        }
                    });
            },
            hideTrack(e, filename) {
                this.delTrack(filename, e.target.parentElement);
            },
            delTrack(fileName, target) {
                axios({
                    method: 'post',
                    url:
                        'https://dailyradio-server.herokuapp.com/favorites/delete',
                    headers: {
                        Authorization: 'Bearer ' + accessToken
                    },
                    data: {
                        song: fileName
                    }
                })
                    .then(res => {
                        this.tracks = res.body;
                        target.style.visibility = 'visible';
                        myAudio2.load();
                        this.getTracks();
                    })
                    .catch(async res => {
                        await refreshTokens({
                            func: this.delTrack,
                            args: [fileName, target]
                        });
                    });
            },
            _imageEncode(arrayBuffer) {
                if (!arrayBuffer) return 'https://i.imgur.com/1Y5Uhk6.png';
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
            PrettyTimeFormat(num) {
                return num < 10 ? `0${num}` : num;
            },
            play(index) {
                myAudio.pause();
                this.count = index;
                myAudio2.src =
                    'https://dailyradio-server.herokuapp.com/music/play/' +
                    this.tracks[this.count].fileName +
                    '/';
                myAudio2.load();
                myAudio2.play();
            },
            nextTrack() {
                this.count = this.count + 1;
                myAudio2.src =
                    'https://dailyradio-server.herokuapp.com/music/play/' +
                    this.tracks[this.count].fileName +
                    '/';
                myAudio2.load();
                myAudio2.play();
            },
            prevTrack() {
                this.count = this.count - 1;
                myAudio2.src =
                    'https://dailyradio-server.herokuapp.com/music/play/' +
                    this.tracks[this.count].fileName +
                    '/';
                myAudio2.load();
                myAudio2.play();
            },
            loadPreload() {
                $('#loader').css('display', 'none');
            }
        },
        created() {
            $('#Player').css('display', 'none');
            $('#Player2').css('display', 'block');
            $('#loader').css('display', 'block');
            $('#loader').css('opacity', '1 !important');
            this.getTracks();
            setTimeout(() => {
                this.loadPreload();
            }, 750);
        },
        mounted() {
            $(myAudio2).on('ended', () => {
                this.nextTrack();
            });
        }
    };
</script>

<style lang="scss">
    @import '../variables';
    #favorites {
        height: 100vh;
        background: $Thoroddsenjökull-2-hex;
        color: $Thoroddsenjökull-4-hex;
    }

    html {
        font-size: 0.9rem;
        @media screen and (min-width: 768px) {
            font-size: 1rem;
        }
    }

    .content {
        margin: 0 auto;
    }

    .wrapper {
        padding-top: 80px;
        padding-bottom: 60px;
    }
    .songActive {
        color: $Thoroddsenjökull-3-hex;
    }
    .song {
        margin-bottom: 8px;
        color: $Thoroddsenjökull-1-hex;
        cursor: pointer;

        &:hover {
            color: $Thoroddsenjökull-3-hex;
        }

        & > div {
            padding: 0;
            margin: 0;
        }

        .song-info {
            min-width: 100px;
        }

        .song-cover {
            min-width: 60px;
            min-height: 60px;
            max-width: 60px;
            max-height: 60px;

            .b-radius {
                border-radius: 8px;
            }
        }

        .song-duration {
            min-width: 36px;
        }
    }

    .refresh-icon {
        position: fixed;
        left: 85%;
        z-index: 20;
        top: 18px;
        font-size: 26px;
        color: black;
        cursor: pointer;

        &:hover {
            color: white;
        }
    }
    .song-controls {
        color: $Thoroddsenjökull-1-hex;
        font-size: 26px;

        &:hover {
            color: $Thoroddsenjökull-3-hex;
            transform: rotate(15deg);
        }
    }
</style>
