import {PointFeature} from "../point-feature.type";
import {PointFeatureType} from "../point-feature-type.enum";

export class SchoolFeature implements PointFeature {
  displayName: string;
  zipCode: string;
  streetAddress: string;
  principal: string;
  category: string;
  schoolID: number;
  // extra stuff
  grad_cohort: number;
  grad_count: string;
  grad_rate : string;
  english_avg:string;
  math_avg:string;
  reading_avg:string;
  science_avg:string;
  act_composite_avg:string;
  percent_dropout:string;
  success_rate:string;
  tvaas_index:string;
  percent_met_growth_standard:string;
  percent_cte:string;
  percent_ca:string;
  act_grad:string;
  percent_longterm_ell:string;
  percent_retained:string;
  type: PointFeatureType = PointFeatureType.SCHOOL;

  /**
   * @param rawJSON
   */
  constructor(rawJSON: {[key: string]: string}) {
    this.displayName = rawJSON['name'];
    this.streetAddress = rawJSON['address'];
    this.zipCode = rawJSON['schoolzip'];
    this.principal = rawJSON['principal'];
    this.category = rawJSON['school_cat'];
    this.schoolID = Number(rawJSON['schl_id']) || -1;
    // extra stuff
    this.grad_cohort = Number(rawJSON['grad_cohort']);
    this.grad_count = rawJSON['grad_count'];
    this.grad_rate = rawJSON['grad_rate'];
    this.english_avg = rawJSON['english_avg'];
    this.math_avg = rawJSON['math_avg'];
    this.reading_avg = rawJSON['reading_avg'];
    this.science_avg = rawJSON['science_avg'];
    this.act_composite_avg = rawJSON['act_composite_avg'];
    this.percent_dropout = rawJSON['percent_dropout'];
    this.success_rate = rawJSON['success_rate'];
    this.tvaas_index = rawJSON['tvaas_index'];
    this.percent_met_growth_standard = rawJSON['percent_met_growth_standard'];
    this.percent_cte = rawJSON['percent_cte'];
    this.percent_ca = rawJSON['percent_ca'];
    this.act_grad = rawJSON['act_grad'];
    this.percent_longterm_ell =rawJSON['percent_longterm_ell'];
    this.percent_retained = rawJSON['percent_retained'];
  }

}
