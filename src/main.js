import Vue from 'vue';
import App from './App.vue';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import VueCompositionApi from '@vue/composition-api';

Vue.use(VueCompositionApi);

Vue.config.productionTip = false;
delete Icon.Default.prototype._getIconUrl;

new Vue({
  render: h => h(App),
}).$mount('#app');

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
