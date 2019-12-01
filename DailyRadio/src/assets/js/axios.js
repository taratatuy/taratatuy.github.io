import axios from 'axios'

export const HTTP = axios.create({
    baseURL: `https://dailyradio-server.herokuapp.com/`,
    // headers: {
    //     Authorization: 'Bearer {token}'
    // }
})