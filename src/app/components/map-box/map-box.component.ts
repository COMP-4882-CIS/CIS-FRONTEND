import { Component, OnInit } from '@angular/core';
import {GeoEvent} from "../../backend/types/geo/geo-event.type";
import {BehaviorSubject, Subject} from "rxjs";

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss']
})
export class MapBoxComponent implements OnInit {

  currentData: Subject<GeoEvent|null> = new Subject<GeoEvent|null>();

  constructor() { }

  ngOnInit(): void {
  }

  popupOpened(event: GeoEvent|null) {
    this.currentData.next(event);
  }
}
