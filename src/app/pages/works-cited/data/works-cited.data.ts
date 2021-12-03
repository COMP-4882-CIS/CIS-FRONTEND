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
  },
  {
    type: DataSourceType.ASPE,
    topic: '2021 Poverty Guidelines',
    url: 'https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines/prior-hhs-poverty-guidelines-federal-register-references/2021-poverty-guidelines',
    description: 'The poverty thresholds are the original version of the federal poverty measure. They are updated each year by the Census Bureau. The thresholds are used mainly for statistical purpose — for instance, preparing estimates of the number of Americans in poverty each year.'
  },
  {
    type: DataSourceType.CENSUS,
    topic: 'How the Census Bureau Measures Poverty',
    url: 'https://www.census.gov/topics/income-poverty/poverty/guidance/poverty-measures.html',
    description: `Following the Office of Management and Budget's (OMB) Statistical Policy Directive 14, the Census Bureau uses a set of money income thresholds that vary by family size and composition to determine who is in poverty. If a family's total income is less than the family's threshold, then that family and every individual in it is considered in poverty.`,
  },
  {
    type: DataSourceType.UWMS,
    topic: 'Poverty',
    url: 'https://www.uwmidsouth.org/poverty/',
    description: `In the Memphis Statistical Metropolitan Area (Memphis MSA), which includes parts of Tennessee, Arkansas, and Mississippi, the overall poverty is 17.1%, child poverty is 27.1%. From people working at or below minimum wage to senior citizens living on a fixed income, thousands in inner-city and rural communities are all suffering from the brunt of poverty.`,
  },
  {
    type: DataSourceType.CR,
    topic: 'Collierville, TN Poverty',
    url: 'https://censusreporter.org/profiles/16000US4716420-collierville-tn/',
    description: `Margin of error is at least 10 percent of the total value. Take care with this statistic.`,
  },
  {
    type: DataSourceType.CR,
    topic: 'Germantown, TN Poverty',
    url: 'https://censusreporter.org/profiles/16000US4728960-germantown-tn/',
    description: `Margin of error is at least 10 percent of the total value. Take care with this statistic.`,
  },
  {
    type: DataSourceType.CR,
    topic: 'Bartlett, TN Poverty',
    url: 'https://censusreporter.org/profiles/16000US4703440-bartlett-tn/',
    description: `Margin of error is at least 10 percent of the total value. Take care with this statistic.`,
  },
  {
    type: DataSourceType.CR,
    topic: 'Arlington, TN Poverty',
    url: 'https://censusreporter.org/profiles/16000US4701740-arlington-tn/',
    description: `Margin of error is at least 10 percent of the total value. Take care with this statistic.`,
  },
  {
    type: DataSourceType.CR,
    topic: 'Millington, TN Poverty',
    url: 'https://censusreporter.org/profiles/16000US4749060-millington-tn/',
    description: `Margin of error is at least 10 percent of the total value. Take care with this statistic.`,
  },

]
