# CIS-FRONTEND

Website: [Child Impact Statements](https://comp-4882-cis.github.io/CIS-FRONTEND/) - Angular Frontend

## Context

The Child Impact Statements Map is a public tool that we believe can aid Shelby County policy makers in answering fundamental questions about how a policy may benefit or harm a child. There is various data within the map that can give more insight on youth and the institutions that shape them in Shelby County.

## Setup

1. First, ensure that you have the [backend](https://github.com/COMP-4882-Capstone-4/Child-Impact-Statements) up and running.
2. Install the npm dependencies: `npm i` or `npm i --force`.
4. Run the application: `npm run start` or `npm run watch`
5. One can set the backend url for development and production in the files `src/app/environment.ts` and `src/app/environment.prod.ts` respectively:

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

The resulting files will be available in `dist`.

## Deploying

To depoly the website, install gh-pages by running 'npm install gh-pages --save-dev'
Then run 'npm run deploy'
The branch gh-pages should update with your changes to deploy to the website, and should deploy them automatically. Make sure your APIURL is set for the backend, and your index.html includes your base h-ref as the url, such as:

```html
<base href="https://shelbycountykiddata.com/">
```
You might also have to reset the custom domain name in the settings-pages section of the frontend, to shelbycountykiddata.com

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

### Help 

[Maintenance and Help Guide](https://github.com/COMP-4882-CIS/CIS-FRONTEND/blob/main/Maintenance-and-Help-Guide.pdf)

[Software Architecture Document](https://github.com/COMP-4882-CIS/CIS-FRONTEND/blob/main/Updated-Software-Architecture.pdf)

[Source Code Document](https://github.com/COMP-4882-CIS/CIS-FRONTEND/blob/main/CIS-Source-Code-Document.pdf)

[User Demonstration Video](https://www.youtube.com/watch?v=kVGI9bi1oKE)
