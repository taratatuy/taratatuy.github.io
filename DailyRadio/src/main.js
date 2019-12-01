import Vue from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlay, faStop, faForward, faVolumeUp, faBackward, faVolumeDown, faVolumeMute, faThumbsUp, faRetweet, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import router from './router.js' 

library.add(faPlay, faStop, faBackward, faForward, faVolumeUp, faVolumeDown, faVolumeMute, faThumbsUp, faRetweet, faTrash)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')