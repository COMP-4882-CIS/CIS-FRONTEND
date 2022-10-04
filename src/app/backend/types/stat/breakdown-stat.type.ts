export interface BreakdownStat {
  totalPopulation: number;
  ageUnder5: number;
  age5To9: number;
  age10To14: number;
  age15To19: number;
  populationInPovertyUnder6: number;
  populationInPoverty6To11: number;
  populationInPoverty12To17: number;
}

export interface ZipCodeBreakdownStat extends BreakdownStat {
  zipCode: number;
}

export interface TractBreakdownStat extends BreakdownStat {
  censusTract: number;
}
