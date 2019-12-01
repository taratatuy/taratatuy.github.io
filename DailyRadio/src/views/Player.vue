<template>
    <div id="Player">
        <footer class="player">
            <div class="container">
                <div
                    class="row justify-content-between pt-2 pb-2 align-items-center"
                >
                    <div class="col-sm-12 col-md-4 d-flex">
                        <div id="player-previous-button" class="player__button">
                            <font-awesome-icon icon="backward" />
                        </div>
                        <div id="play" class="player__button">
                            <font-awesome-icon
                                v-if="flag == false"
                                id="player-play-icon"
                                icon="play"
                            />
                            <font-awesome-icon
                                v-else
                                id="player-play-icon"
                                icon="stop"
                            />
                        </div>
                        <div id="player-next-button" class="player__button">
                            <font-awesome-icon icon="forward" />
                        </div>
                    </div>
                    <div class="col-md-5 col-lg-4">
                        <div class="player__volume">
                            <div
                                id="block-volume-icon"
                                @click="muted()"
                                class="player__icon-volume"
                            >
                                <font-awesome-icon
                                    v-if="volume_icon == 0"
                                    id="volume-icon"
                                    icon="volume-mute"
                                />
                                <font-awesome-icon
                                    v-else-if="volume_icon > 0.5"
                                    id="volume-icon"
                                    icon="volume-up"
                                />
                                <font-awesome-icon
                                    v-else
                                    id="volume-icon"
                                    icon="volume-down"
                                />
                            </div>
                            <input
                                @input="updateValue()"
                                class="player__volume_line"
                                id="volume-line"
                                type="range"
                                name="points"
                                step="0.1"
                                min="0.0"
                                max="1"
                                value="1"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
    import $ from 'jquery';
    import {
        myAudio,
        myAudio2,
        musicUrl,
        setSongName,
        setThisSong,
        getThisSong
    } from '../assets/js/Audio';
    export default {
        name: 'Player',
        data() {
            return {
                flag: false,
                lastVolume: 1,
                volume_icon: 1,
                autoplay: false,
                playlist: [],
                songIndex: -1,
                songName: '',
                title: '',
                artist: '',
                picture: ''
            };
        },
        created() {
            fetch(musicUrl + '/playlist').then(res => {
                res.json().then(data => {
                    this.playlist = data;
                    this.GetNewSong(1);
                });
            });
        },

        mounted() {
            $(myAudio).on('play', () => {
                this.flag = true;
            });

            $(myAudio).on('pause', () => {
                this.flag = false;
            });

            $(myAudio).on('canplay', () => {
                if (this.autoplay) myAudio.play().catch();
            });

            $(myAudio).on('ended', () => {
                this.GetNewSong(1);
            });

            $('#player-previous-button').on('click', () => {
                this.GetNewSong(-1);
                $('.information__numeric_songLength').html('');
            });
            $('#player-next-button').on('click', () => {
                this.GetNewSong(1);
                $('.information__numeric_songLength').html('');
            });

            $(myAudio).on('play', () => {
                this.flag = true;
                this.autoplay = true;
            });

            $(myAudio).on('pause', () => {
                this.flag = false;
                this.autoplay = false;
            });

            $('#play').on('click', () => {
                myAudio2.pause();
                if (this.flag) myAudio.pause();
                else myAudio.play();
            });
        },
        methods: {
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
            muted() {
                if (myAudio.volume != 0) {
                    this.lastVolume = myAudio.volume;
                    myAudio.volume = 0;
                    $('#volume-line').prop('value', 0);
                    this.updateValue();
                } else {
                    myAudio.volume = this.lastVolume;
                    $('#volume-line').prop('value', this.lastVolume);
                    this.updateValue();
                }
            },
            updateValue() {
                let volume_icon = document.getElementById('volume-line').value;
                this.volume_icon = volume_icon;
                myAudio.volume = document.getElementById('volume-line').value;
            },
            GetNewSong(step = 1) {
                if (this.songIndex + step >= this.playlist.length)
                    this.songIndex = 0;
                else if (this.songIndex + step < 0) this.songIndex = 0;
                else this.songIndex += step;

                const songUrl = `${musicUrl}play/${
                    this.playlist[this.songIndex]
                }/`;
                var artist, title, picture;
                fetch(songUrl + 'stats').then(async res => {
                    let songStats = await res.json();
                    setThisSong(songStats);
                    title = songStats.title;
                    artist = songStats.artist;
                    picture = songStats.picture;
                    title = title || 'Unknown title';
                    artist = artist || 'Unknown artist';
                    $('#track-name').html(title + ' - ' + artist);
                    if (picture) {
                        $('#track-image').prop(
                            'src',
                            this._imageEncode(picture.data.data)
                        );
                    } else {
                        $('#track-image').prop(
                            'src',
                            'https://i.imgur.com/1Y5Uhk6.png'
                        );
                    }
                    setSongName(this.playlist[this.songIndex]);
                    myAudio.src = songUrl;
                    myAudio.load();
                });
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
            }
        }
    };
</script>

<style lang="scss">
    @import '../variables';
    .player {
        box-shadow: 0px -3px 7px 5px rgba(0, 0, 0, 0.4);
        background: $Thoroddsenjökull-3-hex;
        width: 100%;
        text-align: center;
        position: fixed;
        bottom: 0;
        left: 0;

        &__volume {
            display: none;

            @media screen and (min-width: 768px) {
                display: block;
            }
        }

        &__button {
            cursor: pointer;
            font-size: 30px;
            color: $Thoroddsenjökull-4-hex;
            margin: 0 auto;

            &:hover {
                color: $Thoroddsenjökull-5-hex;
                animation: buttons-hover 1s;
            }
        }

        &__volume_line {
            outline: none;
            -webkit-appearance: none;
            background-color: $Thoroddsenjökull-5-hex;
            height: 2px;
            position: absolute;
            top: 22px;
            left: 136px;
        }

        &__icon-volume {
            width: 30px;
            float: left;
            font-size: 30px;
            position: relative;
            left: 78px;
            color: $Thoroddsenjökull-4-hex;

            &:hover {
                color: $Thoroddsenjökull-5-hex;
                cursor: pointer;
                animation: buttons-hover 1s;
            }
        }
    }

    input[type='range']::-webkit-slider-thumb {
        vertical-align: middle;
        -webkit-appearance: none;
        background-color: $Thoroddsenjökull-4-hex;
        width: 16px;
        height: 16px;
        border-radius: 16px;
    }
</style>
