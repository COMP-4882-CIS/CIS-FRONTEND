export interface SchoolExportRequest {
  schoolName: string;
  schoolType: string;
  schoolPrincipal: string;
  zipCode: string;
  totalStudents: number;
  totalMaleStudents: number;
  totalFemaleStudents: number;
  gradesTaught: string;
  studentGradeBreakdown: {[key: string]: number};
}
