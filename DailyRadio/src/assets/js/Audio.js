export const myAudio = new Audio();
export const myAudio2 = new Audio();
export const musicUrl = 'https://dailyradio-server.herokuapp.com/music/';
export var songName = '';
export var thisSong;

export function setSongName(songName2) {
    songName = songName2;
}

export function getSongName() {
    return songName;
}

export function setThisSong(thisSong2) {
    thisSong = thisSong2;
}

export function getThisSong() {
    return thisSong;
}
