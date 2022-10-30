// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const packageInfo = require('../../package.json');

export const environment = {
  production: false,
  apiURL: 'http://localhost:3000',
  appTitle: 'Child Impact Resources - Development',
  appVersion: packageInfo.version,
  helpURL: "https://www.youtube.com/watch?v=J27z3uswwjA",
  map: {
    // Another option is https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
    tiles: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    // &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
