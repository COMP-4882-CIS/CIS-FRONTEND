import {Component, Input, OnInit} from '@angular/core';
import {GeoEvent} from "../../backend/types/geo/geo-event.type";
import {ReplaySubject, Subject, Subscription} from "rxjs";
import {BreakdownStatResponse} from "../../backend/responses/stat/breakdown-stat.response";
import {StatService} from "../../backend/services/stat.service";
import {switchMap, tap} from "rxjs/operators";
import {BreakdownStat} from "../../backend/types/stat/breakdown-stat.type";
import {ChartData} from "chart.js";

@Component({
  selector: 'app-map-sidebar',
  templateUrl: './map-sidebar.component.html',
  styleUrls: ['./map-sidebar.component.scss'],
})
export class MapSidebarComponent implements OnInit {

  @Input()
  set data(newValue: GeoEvent | null) {
    if (!!newValue) {
      this.reloadData();
      this.currentData.next(newValue);
    }
  }

  povertyChartData: ReplaySubject<ChartData> = new ReplaySubject<ChartData>();
  genderChartData: ReplaySubject<ChartData> = new ReplaySubject<ChartData>();

  didError = false;
  currentData: Subject<GeoEvent> = new Subject<GeoEvent>();
  populationData: Subject<BreakdownStatResponse | null> = new Subject<BreakdownStatResponse | null>();

  private populationSub?: Subscription;

  constructor(private statService: StatService) {
  }

  ngOnInit(): void {
  }

  getSubtitle(data: GeoEvent) {
    return data.type === 'zip' ? 'ZIP Code' : 'Census Tract';
  }

  getFormattedStat(response: BreakdownStatResponse, key: string): any {
    const stat = this.getStat(response);

    if (!!stat) {
      return (stat as {[key: string]: any})[key];
    }

    return 0;
  }

  getStat(response: BreakdownStatResponse): BreakdownStat|null {
    if (response.stats.length > 0) {
      return response.stats[0];
    }

    return null;
  }

  getPovertyTotal(response: BreakdownStatResponse): number | null {
    const stat = this.getStat(response);

    if (!!stat) {
      return stat.populationInPovertyUnder6 + stat.populationInPoverty6To11 + stat.populationInPoverty12To17;
    }

    return null;
  }

  getGenderChartData(response: BreakdownStatResponse): ChartData|null {
    const stat = this.getStat(response);

    if (!!stat) {
      return {
        labels: ['Female', 'Male'],
        datasets: [
          {
            label: 'Population Breakdown',
            data: [
              stat.populationUnder18Female,
              stat.populationUnder18Male
            ]
          }
        ]
      }
    }

    return null;
  }

  getPovertyChartData(response: BreakdownStatResponse): ChartData|null {
    const stat = this.getStat(response);

    if (!!stat) {
      return {
        labels: [
          'Under age 6',
          'Ages 6 - 11',
          'Ages 12 - 17',
        ],
        datasets: [
          {
            data: [
              stat.populationInPovertyUnder6,
              stat.populationInPoverty6To11,
              stat.populationInPoverty12To17
            ]
          }
        ]
      }
    }

    return null;
  }

  private reloadData() {
    this.didError = false;
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
      }),
      tap(response => {
        const genderChartData = this.getGenderChartData(response);

        if (!!genderChartData) {
          this.genderChartData.next(genderChartData);
          this.genderChartData.complete();
        } else {
          this.didError = true;
        }
      }),
      tap(response => {
        const povertyChartData = this.getPovertyChartData(response);

        if (!!povertyChartData) {
          this.povertyChartData.next(povertyChartData);
          this.genderChartData.complete();
        } else {
          this.didError = true;
        }
      })
    ).subscribe(this.populationData);
  }
}
