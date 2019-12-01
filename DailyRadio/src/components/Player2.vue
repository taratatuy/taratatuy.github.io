<template>
    <div id="Player2">
        <footer class="player">
            <div class="container">
                <div
                    class="row justify-content-between pt-2 pb-2 align-items-center"
                >
                    <div class="col-sm-12 col-md-4 d-flex">
                        <div id="player-previous-button" class="player__button">
                            <font-awesome-icon
                                icon="backward"
                                @click="$emit('prev-track')"
                            />
                        </div>
                        <div id="play" class="player__button">
                            <font-awesome-icon
                                v-if="flag == false"
                                @click="musicPlay()"
                                id="player-play-icon"
                                icon="play"
                            />
                            <font-awesome-icon
                                v-else
                                @click="musicStop()"
                                id="player-play-icon"
                                icon="stop"
                            />
                        </div>
                        <div
                            id="player-next-button"
                            @click="$emit('next-track')"
                            class="player__button"
                        >
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
                                    id="volume-icon2"
                                    icon="volume-mute"
                                />
                                <font-awesome-icon
                                    v-else-if="volume_icon > 0.5"
                                    id="volume-icon2"
                                    icon="volume-up"
                                />
                                <font-awesome-icon
                                    v-else
                                    id="volume-icon2"
                                    icon="volume-down"
                                />
                            </div>
                            <input
                                @input="updateValue()"
                                class="player__volume_line"
                                id="volume-line2"
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
    import { myAudio2, myAudio } from '../assets/js/Audio';
    export default {
        name: 'Player2',
        data() {
            return {
                flag: false,
                lastVolume: 1,
                volume_icon: 1
            };
        },
        mounted() {
            $(myAudio2).on('play', () => {
                this.musicPlay();
            });
        },
        methods: {
            musicPlay() {
                myAudio.pause();
                myAudio2.play();
                this.flag = true;
            },
            musicStop() {
                this.flag = false;
                myAudio2.pause();
            },
            changeIcon() {
                $(myAudio2).on('play', () => {
                    myAudio2.play();
                });

                $(myAudio2).on('pause', () => {
                    myAudio2.pause();
                });
            },
            muted() {
                if (myAudio2.volume != 0) {
                    this.lastVolume = myAudio2.volume;
                    myAudio2.volume = 0;
                    $('#volume-line2').prop('value', 0);
                    this.updateValue();
                } else {
                    myAudio2.volume = this.lastVolume;
                    $('#volume-line2').prop('value', this.lastVolume);
                    this.updateValue();
                }
            },
            updateValue() {
                let volume_icon = document.getElementById('volume-line2').value;
                this.volume_icon = volume_icon;
                myAudio2.volume = document.getElementById('volume-line2').value;
            },
            addTrack() {
                this.$emit('add-track');
            }
        }
    };
</script>
