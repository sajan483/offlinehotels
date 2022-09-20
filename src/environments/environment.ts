
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  adultPerRoomCount : 6,
  childPerRoom : 2,
  maxFlightPax : 9,
  countryCodeCommen : '91',
  timeLeft : 0,
  pendingApiTime : 30000,
  nextApiCallingTime : 2000,
  listApiCallingCount:10,
  selectedCountryCommen : 'India',
  prodUrl:"https://newb2b.umrahtrip.com",


    // baseUrl:'https://b2b.umrahtrip.com/apis/',
    // baseUrl2:'https://b2b.umrahtrip.com/apis/b2b/'

  // baseUrl:'https://betab2b.umrahtrip.com/apis/',
  // baseUrl2:'https://betab2b.umrahtrip.com/apis/b2b/'

   baseUrl:'https://betab2c.umrahtrip.com/apis/',
   baseUrl2:'https://testb2b.umrahtrip.com/apis/b2b/'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
