import {Component, AfterViewInit} from '@angular/core';
import * as L from 'leaflet';
import {GeoTractService} from "../../backend/services/geo-tract.service";
import {switchMap, tap} from "rxjs/operators";

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

  isLoading: boolean = true;

  private map: any;

  private initMap(): void {
    this.map = L.map('map', {
      center: [35.1269, -89.9253],
      zoom: 10
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const tracts = L.geoJSON()
      .bindPopup((layer: any) => `Tract ${layer['feature'].properties.name}`)
      .addTo(this.map);

    const zipCodes = L.geoJSON(undefined, {style: {color: 'red'}})
      .bindPopup((layer: any) => `ZIP Code ${layer['feature'].properties.name}`)
      .addTo(this.map);


    this.geoTractService.getZipCodeFeatures().pipe(
      tap(f => zipCodes.addData(f)),
      switchMap(() => this.geoTractService.getCensusTractFeatures()),
      tap(f => tracts.addData(f))
    ).subscribe(() => {
      this.isLoading = false;
    });

    const zipTractLayers = {
      "ZIP Codes": zipCodes,
      "Census Tracts": tracts
    }

    L.control.layers(undefined, zipTractLayers).addTo(this.map);

    tiles.addTo(this.map);
  }

  constructor(private geoTractService: GeoTractService) {
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
