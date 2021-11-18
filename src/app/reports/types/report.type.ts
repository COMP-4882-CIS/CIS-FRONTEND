import {ReportEntry} from "./report-entry.type";

export class Report {
  entries: ReportEntry[] = [];
  createdOn: Date;

  constructor() {
    this.createdOn = new Date();
  }

  addEntry(...entry: ReportEntry[]) {
    this.entries.push(...entry);
  }

  removeEntry(entry: ReportEntry) {
    const entryIndex = this.entries.indexOf(entry);

    if (entryIndex >= 0) {
      this.entries.splice(entryIndex, 1);
    }
  }

  hasEntry(id: string): boolean {
   return this.entries.findIndex(entry => entry.id === id) >= 0;
  }

  getEntryByID(id: string): ReportEntry | null {
    return this.entries.find(entry => entry.id === id) || null;
  }
}
