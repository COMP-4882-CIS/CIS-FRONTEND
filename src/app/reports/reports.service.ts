import {Injectable} from '@angular/core';
import {Report} from "./types/report.type";
import {ReportEntry} from "./types/report-entry.type";
import {MapSidebarData} from "../components/map-sidebar/map-sidebar-data.type";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  reportEntries: BehaviorSubject<ReportEntry[]> = new BehaviorSubject<ReportEntry[]>([]);

  private _currentReport: Report = new Report();

  constructor() {
  }

  /**
   * Create a ReportEntry in the current report
   * @param id - Identifies the tract or ZIP code that is having an entry created for it
   * @param data - A MapSidebarData item
   */
  createEntry(id: string, data: MapSidebarData) {
    const newEntry = new ReportEntry(id, data.stat);

    newEntry.landmarks = data.landmarks;
    newEntry.povertyChartData = data.povertyChartData;
    newEntry.genderChartData = data.genderChartData;
    newEntry.overallChartData = data.overallChartData;

    this.addEntry(newEntry)
  }

  addEntry(...entry: ReportEntry[]) {
    this._currentReport.addEntry(...entry);
    this.reportEntries.next(this._currentReport.entries);
  }

  hasEntry(id: string): boolean {
    return this._currentReport.hasEntry(id);
  }

  removeEntry(entry: ReportEntry) {
    const beforeLength = Number(this._currentReport.entries.length);

    this._currentReport.removeEntry(entry);

    const afterLength = this._currentReport.entries.length;

    if (beforeLength !== afterLength) {
      this.reportEntries.next(this._currentReport.entries);
    }
  }

  clearReport() {
    this._currentReport = new Report();
    this.reportEntries.next(this._currentReport.entries);
  }

  get totalReportEntries(): number {
    return this._currentReport.entries.length;
  }
}
