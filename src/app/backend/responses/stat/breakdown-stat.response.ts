import {TractBreakdownStat, ZipCodeBreakdownStat} from "../../types/stat/breakdown-stat.type";

export interface BreakdownStatResponse {
  type: string;
  stats: ZipCodeBreakdownStat[] | TractBreakdownStat[];
}

export interface ZipCodeBreakdownStatResponse extends BreakdownStatResponse {
  type: string;
  stats: ZipCodeBreakdownStat[];
}

export interface TractBreakdownStatResponse extends BreakdownStatResponse {
  type: string;
  stats: TractBreakdownStat[];
}
