import axios from 'axios'
export var accessToken = null;
export var refreshToken = null;

export function getTokens() {
    console.log(accessToken);
    console.log(refreshToken);
}

export function setTokens(accessToken2, refreshToken2) {
    accessToken = accessToken2;
    refreshToken = refreshToken2;
}

export function refreshTokens(callbeck) {
    axios({
        method: 'post',
        url: "https://dailyradio-server.herokuapp.com/auth/refresh",
        data: {
            refreshToken: refreshToken,
        }
    }).then( res => {
        refreshToken = res.data.refreshToken;
        accessToken = res.data.accessToken;
        if (callbeck.args) callbeck.func(...callbeck.args);
        else callbeck.func();
    });
}

export function resetTokens() {
    accessToken = null;
    refreshToken = null;
}