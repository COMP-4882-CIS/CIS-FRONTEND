const packageInfo = require('../../package.json');

export const environment = {
  production: true,
  apiURL: 'https://cis-b.herokuapp.com/',
  appTitle: 'Child Impact Resources',
  appVersion: packageInfo.version,
  helpURL: "https://www.youtube.com/watch?v=kVGI9bi1oKE",
  map: {
    // Another option is https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
    tiles: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    // &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
  }
};
