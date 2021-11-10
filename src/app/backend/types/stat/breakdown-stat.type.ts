export interface BreakdownStat {
  totalPopulation: number;
  populationUnder18: number;
  populationUnder18Male: number;
  populationUnder18Female: number;
  populationInPovertyUnder6: number;
  populationInPoverty6To11: number;
  populationInPoverty12To17: number;
}

export interface ZipCodeBreakdownStat extends BreakdownStat {
  zipCode: number;
}

export interface TractBreakdownStat extends BreakdownStat {
  tract: number;
}
