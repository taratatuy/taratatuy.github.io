import Vue from 'vue';
import VueRouter from 'vue-router';

import Radio from './views/Radio';
import FavoritesList from './views/FavoritesList';
import Profile from './views/Profile';
import User from './components/User';
import Auth from './components/Auth';
import Registration from './components/Registration';

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/radio',
            component: Radio
        },

        {
            path: '/favorites-list',
            component: FavoritesList
        },

        {
            path: '/profile',
            component: Profile,
            children: [
                { path: 'user', component: User },
                { path: '', component: Auth },
                { path: 'reg', component: Registration }
            ]
        }
    ],
    mode: 'history'
});
