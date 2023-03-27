/// <reference types="node" />
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: Environment = {
  production: false,
  apiUrl: process.env.NG_APP_BLE_API_URL || {{API_URL}},
  apiKey: process.env.NG_APP_ADMIN_API_KEY || {{API_KEY}},
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

export interface Environment {
  production: boolean;
  apiUrl: string;
  apiKey: string;
}