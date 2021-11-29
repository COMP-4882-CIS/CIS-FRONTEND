import {DataSource} from "../types/data-source.type";
import {DataSourceType} from "../types/data-source-type.enum";

export const worksCitedData: DataSource[] = [
  {
    type: DataSourceType.MDH,
    topic: 'ZIP Codes',
    url: 'https://data.memphistn.gov/Neighborhoods/Zip-Codes-City-of-Memphis/6arv-kma7',
    description: `The dataset provides GeoJSON shapes that define the Geo-spatial boundaries of the ZIP Codes within the City of Memphis.`,
  },
  {
    type: DataSourceType.MDH,
    topic: 'Parks',
    url: 'https://data.memphistn.gov/Neighborhoods/City-of-Memphis-Parks-Spatial-Data/aeu5-vwkq',
    description: `This dataset provides GeoJSON points that define the Parks located within the City of Memphis.`,
  },
  {
    type: DataSourceType.MDH,
    topic: 'Community Centers',
    url: 'https://data.memphistn.gov/Neighborhoods/Community-Centers-Shapefile/hh7a-g7mu',
    description: `The dataset represents the locations of community centers managed by the City of Memphis Parks and Recreation Department.`,
  },
  {
    type: DataSourceType.MDH,
    topic: 'Libraries',
    url: 'https://data.memphistn.gov/Neighborhoods/Memphis-Public-Libraries-Shapefile/4kk2-hed2',
    description: `The dataset describes the locations of the Memphis Public Libraries within the City of Memphis.`,
  },
  {
    type: DataSourceType.CENSUS,
    topic: 'Tracts',
    url: 'https://api.census.gov/data/2018/acs/acs5/subject',
    description: `The American Community Survey (ACS) is an ongoing survey that provides data every year, giving communities the current information they need to plan investments and services. The ACS covers a broad range of topics about social, economic, demographic, and housing characteristics of the U.S. population. The subject tables include the following geographies: nation, all states (including DC and Puerto Rico), all metropolitan areas, all congressional districts, all counties, all places and all tracts. Subject tables provide an overview of the estimates available in a particular topic. The data are presented as both counts and percentages. There are over 66,000 variables in this dataset.`,
  },
  {
    type: DataSourceType.CENSUS,
    topic: 'Male Population - Under 18 years of age',
    url: 'https://api.census.gov/data/2018/acs/acs5/subject/variables/S0101_C03_022E.json',
    description: `Estimate!!Male!!Total population!!SELECTED AGE CATEGORIES!!Under 18 years`,
  },
  {
    type: DataSourceType.CENSUS,
    topic: 'Female Population - Under 18 years of age',
    url: 'https://api.census.gov/data/2018/acs/acs5/subject/variables/S0101_C05_022E.json',
    description: `Estimate!!Female!!Total population!!SELECTED AGE CATEGORIES!!Under 18 years.`,
  },
  {
    type: DataSourceType.CENSUS,
    topic: 'Total Population in poverty - Under 18 years of age',
    url: 'https://api.census.gov/data/2018/acs/acs5/subject/variables/S0501_C02_108E.json',
    description: `Estimate!!Native!!POVERTY STATUS IN THE PAST 12 MONTHS!!POVERTY RATES FOR FAMILIES FOR WHOM POVERTY STATUS IS DETERMINED!!All families!!With related children of the householder under 18 years.`,
  },
  {
    type: DataSourceType.TNEDU,
    topic: 'Shelby County Schools Enrollment Statistics',
    url: 'https://www.tn.gov/content/dam/tn/education/data/membership201920.xlsx',
    description: 'This Excel file provided by the TN Department of Education lists enrollment statistics for all TN schools from the 2019-2020 school year.'
  }
]
