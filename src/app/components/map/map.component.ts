import {Component, AfterViewInit, Output, EventEmitter} from '@angular/core';
import * as L from 'leaflet';
import {GeoTractService} from "../../backend/services/geo-tract.service";
import {switchMap, tap, map as rxMap} from "rxjs/operators";
import {GeoEvent} from "../../backend/types/geo/geo-event.type";
import {GeoJSON, Layer, PopupEvent} from "leaflet";
import {Feature, Geometry} from "geojson";
import 'src/assets/leaflet/SmoothWheelZoom.js';
import {GeoLayer} from "../../backend/types/geo/geo-layer.type";
import {CensusFeature} from "../../backend/types/geo/census-feature.type";
import {GeoDataRequest} from "../../backend/requests/geo/geo-data.request";
import {TractFeatureProperties, ZipFeatureProperties} from "../../backend/types/geo/census-feature-properties.type";
import {StatService} from "../../backend/services/stat.service";

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

  private zipLayers: Layer[] = [];
  private tractLayers: Layer[] = [];
  private popupOpen = false;
  private map?: L.Map;

  constructor(private geoTractService: GeoTractService,
              private statService: StatService) {

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
   * Setup the Leaflet map
   * @private
   */
  private initMap(): void {
    let mapConfig: L.MapOptions = {
      center: [35.1269, -89.9253],
      zoom: 11,
      minZoom: 11,
      zoomControl: true,
      preferCanvas: true,
    }

    if (navigator.platform.indexOf('Mac') === 0) {
      mapConfig = {
        ...mapConfig,
        scrollWheelZoom: false, // disable original zoom function
        // @ts-ignore
        smoothWheelZoom: true,  // enable smooth zoom
        smoothSensitivity: 1,   // zoom speed. default is 1
      }
    }

    this.map = L.map('map', mapConfig);

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

    this.fetchMapData(this.map);
    this.attachEvents(this.map);
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

    map.on('zoomend', () => this.refreshCalloutLabels());
    map.on('baselayerchange', () => this.refreshCalloutLabels());
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

      this.geoTractService.getCensusTractFeatures().pipe(
        tap(f => tracts.addData(f)),
        switchMap(() => this.geoTractService.getZipCodeFeatures()),
        tap(f => zipCodes.addData(f)),
        switchMap(() => this.geoTractService.getParksFeatures()),
        tap(f => parks.addData(f)),
        switchMap(() => this.geoTractService.getLibraryFeatures()),
        tap(f => libraries.addData(f))
      ).subscribe(() => {
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

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const overlayLayers = {
      "Libraries": libraries,
      "Parks": parks
    }

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

    this.fetchMapPopulationData(map).subscribe((maxStats) => {
      const baseLayers = {
        'ZIP Codes': zipCodes,
        'Tracts': tracts
      }

      L.control.layers(baseLayers, overlayLayers, {collapsed: false}).addTo(map);


      zipCodes.setStyle(feature => {
        const style = {
          opacity: 1.0,
          fillOpacity: 1.0
        };

        if (!!feature?.properties) {
          let opacity = 0.1;
          const properties = feature.properties as ZipFeatureProperties;
          const population = properties.populationUnder18;

          if (population > 0) {
            opacity = Math.max(Math.min((population / maxStats.maxZip), 0.6), 0.2);
          }

          style.opacity = opacity;
          style.fillOpacity = opacity;
        }


        return style;
      });

      tracts.setStyle(feature => {
        const style = {
          opacity: 1.0,
          fillOpacity: 1.0
        };

        if (!!feature?.properties) {
          let opacity = 0.1;
          const properties = feature.properties as TractFeatureProperties;
          const population = properties.populationUnder18;

          if (population > 0) {
            opacity = Math.max(Math.min((population / maxStats.maxTract), 0.6), 0.2);
          }

          // style.opacity = opacity;
          style.fillOpacity = opacity;
        }


        return style;
      });

   //   this.bindLabels(tracts, 'tract', map);
   //   this.bindLabels(zipCodes, 'zipcode', map);

      tracts.removeFrom(map);

      this.isLoading = false;
    });
  }

  /**
   * Add callout labels to feature collections
   * @param feature - L.GeoJSON (tracts/zipCodes)
   * @param type - zipcode/tract
   * @param map
   * @private
   */
  private bindLabels(feature: L.GeoJSON, type: 'zipcode' | 'tract', map: L.Map) {
    feature.eachLayer(rawLayer => {
      const layer = rawLayer as unknown as GeoLayer;
      if (!!layer.feature.properties) {
        const content = (type === 'zipcode' ? layer.feature.properties.name : `T${layer.feature.properties.tract}`);

        rawLayer.bindTooltip(
          content,
          {
            permanent: true,
            direction: 'center',
            className: `${type}-label map-geo-label ${map.getZoom() < 12 ? 'hide' : 'show'}`
          });
      }
    })
  }

  /**
   * Fetch the population stats and append them to the feature (geometry) properties
   * @param map - Leaflet map
   * @private
   */
  private fetchMapPopulationData(map: L.Map) {
    const requestItems: GeoDataRequest[] = [];

    map.eachLayer(rawLayer => {
      const layer = rawLayer as unknown as GeoLayer;
      const feature = layer.feature as unknown as CensusFeature;

      if (!!feature) {
        if (!!feature.properties && !!feature.properties.type && ['tract', 'zip'].includes(feature.properties.type)) {
          let id: string;

          if (feature.properties.type === 'zip') {
            id = (feature.properties as ZipFeatureProperties).name;
          } else {
            id = (feature.properties as TractFeatureProperties).tract;
          }

          requestItems.push({
            type: feature.properties.type,
            layer: rawLayer,
            id
          });
        }
      }
    });

    return this.statService.requestMapGeoStats(requestItems).pipe(
      tap(layerResults => {
        this.zipLayers = layerResults[0].layers;
        this.tractLayers = layerResults[1].layers;
      }),
      rxMap(layerResults => {
        return {
          maxZip: layerResults[0].max,
          maxTract: layerResults[1].max
        }
      })
    );
  }

  /**
   * Refresh the callout labels
   * @private
   */
  private refreshCalloutLabels() {
    if (!!this.map) {
      if (this.map.getZoom() < 12) {
        document.querySelectorAll('.map-geo-label').forEach(l => l.classList.replace('show', 'hide'))
      } else {
        document.querySelectorAll('.map-geo-label').forEach(l => l.classList.replace('hide', 'show'))
      }
    }
  }
}
