import {Component, Input} from '@angular/core';
import {BreakdownStat, TractBreakdownStat, ZipCodeBreakdownStat} from "../../backend/types/stat/breakdown-stat.type";
import {DistrictFeature} from "../../backend/types/geo/features/layer";
import {LandmarkSummaryResponse} from "../../backend/responses/landmark/landmark-summary.response";
import {ExportService} from "../../backend/services/export.service";

@Component({
  selector: 'app-breakdown-school',
  templateUrl: './breakdown-school.component.html',
  styleUrls: ['./breakdown-school.component.scss']
})

export class BreakdownSchoolComponent {
    @Input()
    title!: string;
}