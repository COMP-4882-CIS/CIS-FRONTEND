import {Component, Input, OnInit} from '@angular/core';
import {GeoEvent} from "../../backend/types/geo/geo-event.type";
import {Subject} from "rxjs";

@Component({
  selector: 'app-map-sidebar',
  templateUrl: './map-sidebar.component.html',
  styleUrls: ['./map-sidebar.component.scss']
})
export class MapSidebarComponent implements OnInit {

  @Input()
  set data(newValue: GeoEvent|null) {
    if (!!newValue) {
      this.currentData.next(newValue);
    }
  }

  currentData: Subject<GeoEvent> = new Subject<GeoEvent>();

  constructor() { }

  ngOnInit(): void {
  }

  getSubtitle(data: GeoEvent) {
    return data.type === 'zip' ? 'ZIP Code' : 'Census Tract';
  }
}
