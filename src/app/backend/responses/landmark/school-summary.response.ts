export interface SchoolSummaryResponse {
  gradesTaught: string[];
  racesEnrolled: string[];
  gendersEnrolled: string[];
  totalEnrolled: number;
  racialEnrollmentBreakdown: { [key: string]: number };
  genderEnrollmentBreakdown: { [key: string]: number };
  gradeEnrollmentBreakdown: { [key: string]: number };
  districtID: number;
  districtName: string;
  schoolID: number;
  schoolName: string;
}
