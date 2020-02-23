const path = require('path');

module.exports = {
  devServer: {
    proxy: 'https://opensky-network.org/',
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/chemtrails-guru/' : '/',
  /*
   * Issue with peer dependencies required to make an alias to point to a single
   * leaflet root instance as in https://github.com/jurb/vue2-leaflet-heatmap/issues/1
   */
  configureWebpack: {
    resolve: {
      alias: {
        leaflet: path.join(__dirname, 'node_modules/leaflet'),
      },
    },
  },
};
