import {Component, AfterViewInit, Output, EventEmitter} from '@angular/core';
import * as L from 'leaflet';
import {GeoTractService} from "../../backend/services/geo-tract.service";
import {switchMap, tap} from "rxjs/operators";
import {GeoEvent} from "../../backend/types/geo/geo-event.type";
import {PopupEvent} from "leaflet";
import {Feature} from "geojson";

import 'src/assets/leaflet/SmoothWheelZoom.js';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements AfterViewInit {

  @Output()
  popupOpened: EventEmitter<GeoEvent|null> = new EventEmitter<GeoEvent|null>();

  isLoading: boolean = true;

  private map?: L.Map;

  private initMap(): void {
    this.map = L.map('map', {
      center: [35.1269, -89.9253],
      zoom: 11,
      minZoom: 11,
      zoomControl: true,
      scrollWheelZoom: false, // disable original zoom function

      // @ts-ignore
      smoothWheelZoom: true,  // enable smooth zoom
      smoothSensitivity: 1,   // zoom speed. default is 1
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const tracts = L.geoJSON()
      .bindPopup((layer: any) => `Tract ${layer['feature'].properties.tract}`)
      .addTo(this.map);

    const zipCodes = L.geoJSON(undefined, {style: {color: 'red'}})
      .bindPopup((layer: any) => `ZIP Code ${layer['feature'].properties.name}`)
      .addTo(this.map);


    this.geoTractService.getCensusTractFeatures().pipe(
      tap(f => tracts.addData(f)),
      switchMap(() => this.geoTractService.getZipCodeFeatures()),
      tap(f => zipCodes.addData(f))
    ).subscribe(() => {
      this.isLoading = false;

      if (!!this.map) {
        this.map.fitBounds(zipCodes.getBounds());
        this.map.setMaxBounds(zipCodes.getBounds());
      }
    });

    const zipTractLayers = {
      "ZIP Codes": zipCodes,
      "Census Tracts": tracts
    }

    L.control.layers(undefined, zipTractLayers).addTo(this.map);

    tiles.addTo(this.map);

    this.map.on('popupopen', (e: PopupEvent) => {
      const feature = (e.popup as unknown as {_source: any})._source.feature as Feature;

      if (!!feature.properties) {
        let eventType: 'tract' | 'zip' = 'tract';

        if (feature.properties.hasOwnProperty('name')) {
          eventType = 'zip';
        }

        this.popupOpened.emit({
          type: eventType,
          data: (eventType === 'zip' ? feature.properties['name'] : feature.properties['tract'])
        });
      }
    });

    this.map.on('click', (e) => {
      this.popupOpened.emit(null);
    });
  }

  constructor(private geoTractService: GeoTractService) {
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
