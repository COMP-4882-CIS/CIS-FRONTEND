import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {GeoEvent} from "../../backend/types/geo/geo-event.type";
import {Subject, Subscription} from "rxjs";
import {BreakdownStatResponse} from "../../backend/responses/stat/breakdown-stat.response";
import {StatService} from "../../backend/services/stat.service";
import {switchMap} from "rxjs/operators";
import {BreakdownStat} from "../../backend/types/stat/breakdown-stat.type";
import {ChartDataset} from "chart.js";

@Component({
  selector: 'app-map-sidebar',
  templateUrl: './map-sidebar.component.html',
  styleUrls: ['./map-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapSidebarComponent implements OnInit {

  @Input()
  set data(newValue: GeoEvent|null) {
    if (!!newValue) {
      this.reloadData();
      this.currentData.next(newValue);
    }
  }

  currentData: Subject<GeoEvent> = new Subject<GeoEvent>();
  populationData: Subject<BreakdownStatResponse|null> = new Subject<BreakdownStatResponse|null>();

  private populationSub?: Subscription;

  constructor(private statService: StatService) {
  }

  ngOnInit(): void {
  }

  getSubtitle(data: GeoEvent) {
    return data.type === 'zip' ? 'ZIP Code' : 'Census Tract';
  }

  getStat(response: BreakdownStatResponse): BreakdownStat {
    return response.stats[0];
  }

  getPovertyTotal(response: BreakdownStatResponse): number {
    const stat = this.getStat(response);

    return stat.populationInPovertyUnder6 + stat.populationInPoverty6To11 + stat.populationInPoverty12To17;
  }

  getChartData(response: BreakdownStatResponse): ChartDataset[] {
    const stat = this.getStat(response);

    return [
      { data: [stat.populationUnder18Female, stat.populationUnder18Male]}
    ];
  }

  private reloadData() {
    this.populationData.next(null);

    if (!!this.populationSub) {
      this.populationSub.unsubscribe();
    }

    this.populationSub = this.currentData.pipe(
      switchMap(ev => {
        if (ev.type === 'zip') {
          return this.statService.getZipCodeBreakdown(ev.data)
        }

        return this.statService.getTractBreakdown(ev.data);
      })
    ).subscribe(this.populationData);
  }
}
