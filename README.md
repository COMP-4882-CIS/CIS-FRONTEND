# ng-cis

Child Impact Statements - Angular Frontend

## Setup

1. First, ensure that you have the [backend](https://github.com/COMP-4882-Capstone-4/Child-Impact-Statements) up and running.
2. Install the npm dependencies: `npm i`.
3. Run the application: `npm run start` or `npm run watch`
4. One can set the backend url for development and production in the files `src/app/environment.ts` and `src/app/environment.prod.ts` respectively:

```typescript
// Development
export const environment = {
  production: false,
  apiURL: 'http://localhost:3000'
};

```

```typescript
// Production
export const environment = {
  production: true,
  apiURL: 'https://cis-backend-comp-4882.herokuapp.com'
};

```


## Building

To build the project, please run `npm run build`. 

The resulting files will be available in `dist/CIS`.

## Datasets
* [Census Tracts](https://data.memphistn.gov/Public-Safety/Census-Tracts/e4xa-n94q) - Memphis Data Hub
* [Parks](https://data.memphistn.gov/Neighborhoods/City-of-Memphis-Parks-Spatial-Data/aeu5-vwkq) - Memphis Data Hub
* [Community Centers](https://data.memphistn.gov/Neighborhoods/Community-Centers-Shapefile/hh7a-g7mu) - Memphis Data Hub
* [City Council Districts](https://data.memphistn.gov/Good-Government/City-Council-Districts-Boundaries/d874-nrqr) - Memphis Data Hub
* [Libraries](https://data.memphistn.gov/Neighborhoods/Memphis-Public-Libraries-Shapefile/4kk2-hed2) - Memphis Data Hub
* [ZIP Codes](https://data.memphistn.gov/dataset/Shelby-County-Zip-Codes/98jk-gvpk) - Memphis Data Hub

### Updating Datasets

To update a dataset, visit the links above and click 'Export', selecting the 'GeoJSON' option. 
Rename and replace the resulting file in `src/assets/data`.
