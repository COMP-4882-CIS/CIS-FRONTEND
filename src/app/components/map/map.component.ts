import {Component, AfterViewInit, Output, EventEmitter} from '@angular/core';
import * as L from 'leaflet';
import {GeoTractService} from "../../backend/services/geo-tract.service";
import {switchMap, tap} from "rxjs/operators";
import {GeoEvent} from "../../backend/types/geo/geo-event.type";
import {GeoJSON, PopupEvent} from "leaflet";
import {Feature, Geometry} from "geojson";

import 'src/assets/leaflet/SmoothWheelZoom.js';
import {GeoLayer} from "../../backend/types/geo/geo-layer.type";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements AfterViewInit {

  @Output()
  popupOpened: EventEmitter<GeoEvent | null> = new EventEmitter<GeoEvent | null>();

  isLoading: boolean = true;

  private tractsGeoJSON?: GeoJSON;
  private zipCodesGeoJSON?: GeoJSON;
  private parksGeoJSON?: GeoJSON;
  private librariesGeoJSON?: GeoJSON;
  private centersGeoJSON?: GeoJSON;

  private popupOpen = false;
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


    this.tractsGeoJSON = L.geoJSON()
      .bindPopup((layer: any) => `Tract ${layer['feature'].properties.tract}`)
      .addTo(this.map);

    this.zipCodesGeoJSON = L.geoJSON(undefined, {style: {color: 'red'}})
      .bindPopup((layer: any) => `ZIP Code ${layer['feature'].properties.name}`)
      .addTo(this.map);

    this.parksGeoJSON = L.geoJSON(undefined, {
      pointToLayer: (feature, latlng) => {
        const parkIcon = L.icon({
          iconUrl: 'assets/icons/park-icon.png',
          iconSize: [40, 40],
        });

        return L.marker(latlng, {icon: parkIcon})
      },
      filter: (feature: Feature<Geometry, any>): boolean => {
        return feature.properties.hasOwnProperty('park_nam_1') && !!feature.properties.park_nam_1
      }
    }).bindPopup((layer: any) => `${layer['feature'].properties.park_nam_1}`)
      .addTo(this.map);

    this.librariesGeoJSON = L.geoJSON(undefined, {
      pointToLayer: (feature, latlng) => {
        const libraryIcon = L.icon({
          iconUrl: 'assets/icons/book.png',
          iconSize: [40, 40], // size of the icon
        });
        return L.marker(latlng, {icon: libraryIcon})
      },
    })
      .bindPopup((layer: any) => `${layer['feature'].properties.user_name}`)
      .addTo(this.map);

    this.centersGeoJSON = L.geoJSON(undefined, {
      pointToLayer: (feature, latlng) => {
        const centersIcon = L.icon({
          iconUrl: 'assets/icons/center.png',
          iconSize: [40, 40],
        });

        return L.marker(latlng, {icon: centersIcon})
      },
    }).bindPopup((layer: any) => `${layer['feature'].properties.community_}`)
      .addTo(this.map);

    this.fetchMapData(this.map);
    this.attachEvents(this.map);
  }

  constructor(private geoTractService: GeoTractService) {

    // This logic ensures the Leaflet container is only resized when needed
    this.popupOpened.subscribe((d) => {
      if (!!d && !this.popupOpen) {
        this.resizeMap();
        this.popupOpen = true;
      } else if (d === null && this.popupOpen) {
        this.resizeMap();
        this.popupOpen = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  /**
   * Resize the Leaflet map container
   *
   * Internally calls invalidate size after ensuring the L.map object is defined
   * @private
   */
  private resizeMap() {
    setTimeout(() => {
      if (!!this.map) {
        this.map.invalidateSize({animate: true});
      }
    }, 150);
  }

  /**
   * Attach the popup events to an L.map object
   *
   * @param map - L.Map
   * @private
   */
  private attachEvents(map: L.Map) {
    map.on('popupopen', (e: PopupEvent) => {
      const feature = (e.popup as unknown as { _source: any })._source.feature as Feature;

      if (!!feature.properties && ['tract', 'zip'].includes(feature.properties.type)) {
        let eventType: 'tract' | 'zip' = feature.properties.type;

        if (feature.properties.hasOwnProperty('name')) {
          eventType = 'zip';
        }

        this.popupOpened.emit({
          type: eventType,
          data: (eventType === 'zip' ? feature.properties['name'] : feature.properties['tract'])
        });
      } else {
        this.popupOpened.emit(null);
      }
    });

    map.on('click', () => this.popupOpened.emit(null));
  }

  /**
   * Fetch the Tract/ZIP Code Feature Geometry
   *
   * @param map - L.Map
   * @private
   */
  private fetchMapData(map: L.Map) {
    if (!!this.tractsGeoJSON && !!this.zipCodesGeoJSON) {
      const tracts = this.tractsGeoJSON as GeoJSON;
      const zipCodes = this.zipCodesGeoJSON as GeoJSON;
      const parks = this.parksGeoJSON as GeoJSON;
      const libraries = this.librariesGeoJSON as GeoJSON;
      const centers = this.centersGeoJSON as GeoJSON;

      this.geoTractService.getCensusTractFeatures().pipe(
        tap(f => tracts.addData(f)),
        switchMap(() => this.geoTractService.getZipCodeFeatures()),
        tap(f => zipCodes.addData(f)),
        switchMap(() => this.geoTractService.getParksFeatures()),
        tap(f => parks.addData(f)),
        switchMap(() => this.geoTractService.getLibraryFeatures()),
        tap(f => libraries.addData(f)),
        switchMap(() => this.geoTractService.getCentersFeatures()),
        tap(f => centers.addData(f))
      ).subscribe(() => {
        this.isLoading = false;

        if (!!this.map) {
          const outerBounds = zipCodes.getBounds().pad(0.5);

          this.map.fitBounds(outerBounds);
          this.map.setMaxBounds(outerBounds);
          this.appendMapData(map);
        }
      });
    }
  }

  /**
   * Show the Tract/ZIP Code Feature Geometry
   *
   * Ensure the tractsGeoJSON/zipCodesGeoJSON objects are defined before calling this!
   * @param map - L.Map
   * @private
   */
  private appendMapData(map: L.Map) {
    const tracts = this.tractsGeoJSON as GeoJSON;
    const zipCodes = this.zipCodesGeoJSON as GeoJSON;
    const parks = this.parksGeoJSON as GeoJSON;
    const libraries = this.librariesGeoJSON as GeoJSON;
    const centers = this.centersGeoJSON as GeoJSON;

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });


    const baseLayers = {
      "ZIP Codes": zipCodes,
      "Census Tracts": tracts,
    }

    const overlayLayers = {
      "Libraries": libraries,
      "Community Centers": centers
      "Parks": parks
    }

    L.control.layers(baseLayers, overlayLayers, {collapsed: false}).addTo(map);

    tiles.addTo(map);

    tracts.eachLayer(rawLayer => {
      const layer = rawLayer as unknown as GeoLayer;

      if (!!layer.feature.properties) {
        layer.feature.properties.type = 'tract';
      }
    });

    zipCodes.eachLayer(rawLayer => {
      const layer = rawLayer as unknown as GeoLayer;

      if (!!layer.feature.properties) {
        layer.feature.properties.type = 'zip';
      }
    });

    libraries.eachLayer(rawLayer => {
      const layer = rawLayer as unknown as GeoLayer;

      if (!!layer.feature.properties) {
        layer.feature.properties.type = 'library';
      }
    });

    centers.eachLayer(rawLayer => {
      const layer = rawLayer as unknown as GeoLayer;

      if (!!layer.feature.properties) {
        layer.feature.properties.type = 'centers';
      }
    });

    tracts.removeFrom(map);
  }
}
