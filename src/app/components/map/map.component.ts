import {AfterViewInit, Component, EventEmitter, Output} from '@angular/core';
import * as L from 'leaflet';
import {GeoJSON, Layer, PopupEvent} from 'leaflet';
import {map as rxMap, switchMap, tap} from "rxjs/operators";
import {Feature, Geometry} from "geojson";
import {FeatureHelper, LayerHelper, PopupHelper} from "../../helpers";
import {DistrictFeature, LayerFeature, TractFeature, ZipcodeFeature} from "../../backend/types/geo/features/layer";
import {LayerFeatureType} from "../../backend/types/geo/features/layer/layer-feature-type.enum";
import {PointFeatureType} from "../../backend/types/geo/features/point/point-feature-type.enum";
import {GeoTractService, StatService} from "../../backend/services";
import {GeoDataRequest} from "../../backend/requests/geo";
import {GeoEvent, GeoLayer} from "../../backend/types/geo";
import 'src/assets/leaflet/SmoothWheelZoom.js';
import {PointFeature} from "../../backend/types/geo/features/point";


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
  private districtsGeoJSON?: GeoJSON;
  private parksGeoJSON?: GeoJSON;
  private librariesGeoJSON?: GeoJSON;
  private centersGeoJSON?: GeoJSON;

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

    this.districtsGeoJSON = L.geoJSON(undefined, {
      interactive: false,
      style: {color: 'rgb(255, 159, 64)', fillOpacity: 0, weight: 8, opacity: 1.0}
    })
      .bindPopup(layer => PopupHelper.bindLayerPopup(LayerFeatureType.DISTRICT, layer))
      .addTo(this.map);

    this.tractsGeoJSON = L.geoJSON()
      .bindPopup(layer => PopupHelper.bindLayerPopup(LayerFeatureType.TRACT, layer))
      .addTo(this.map);

    this.zipCodesGeoJSON = L.geoJSON(undefined, {style: {color: 'red'}})
      .bindPopup(layer => PopupHelper.bindLayerPopup(LayerFeatureType.ZIP_CODE, layer))
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
    }).bindPopup(layer => PopupHelper.bindPointPopup(PointFeatureType.PARK, layer))
      .addTo(this.map);

    this.librariesGeoJSON = L.geoJSON(undefined, {
      pointToLayer: (feature, latlng) => {
        const libraryIcon = L.icon({
          iconUrl: 'assets/icons/book.png',
          iconSize: [40, 40], // size of the icon
        });
        return L.marker(latlng, {icon: libraryIcon})
      },
    }).bindPopup(layer => PopupHelper.bindPointPopup(PointFeatureType.LIBRARY, layer))
      .addTo(this.map);

    this.centersGeoJSON = L.geoJSON(undefined, {
      pointToLayer: (feature, latlng) => {
        const centersIcon = L.icon({
          iconUrl: 'assets/icons/center.png',
          iconSize: [40, 40],
        });

        return L.marker(latlng, {icon: centersIcon})
      },
    }).bindPopup(layer => PopupHelper.bindPointPopup(PointFeatureType.COMMUNITY_CENTER, layer))
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

      if (!!feature.properties) {
        const genericLayer: PointFeature | LayerFeature = feature.properties as PointFeature | LayerFeature;

        this.popupOpened.emit({
          type: genericLayer.type,
          data: genericLayer
        })

      } else {
        this.popupOpened.emit(null);
      }
    });

    map.on('click', () => this.popupOpened.emit(null));

    map.on('zoomend', () => this.refreshCalloutLabels());
    map.on('baselayerchange', () => {
      this.refreshCalloutLabels();
      this.districtsGeoJSON?.bringToFront();
    });
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
      const districts = this.districtsGeoJSON as GeoJSON;
      const parks = this.parksGeoJSON as GeoJSON;
      const libraries = this.librariesGeoJSON as GeoJSON;
      const centers = this.centersGeoJSON as GeoJSON;

      this.geoTractService.getCensusTractFeatures().pipe(
        tap(f => tracts.addData(f)),
        switchMap(() => this.geoTractService.getZipCodeFeatures()),
        tap(f => zipCodes.addData(f)),
        switchMap(() => this.geoTractService.getDistrictFeatures()),
        tap(f => districts.addData(f)),
        switchMap(() => this.geoTractService.getParksFeatures()),
        tap(f => parks.addData(f)),
        switchMap(() => this.geoTractService.getLibraryFeatures()),
        tap(f => libraries.addData(f)),
        switchMap(() => this.geoTractService.getCentersFeatures()),
        tap(f => centers.addData(f))
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
    const districts = this.districtsGeoJSON as GeoJSON;
    const parks = this.parksGeoJSON as GeoJSON;
    const libraries = this.librariesGeoJSON as GeoJSON;
    const centers = this.centersGeoJSON as GeoJSON;

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const overlayLayers = {
      "Libraries": libraries,
      "Community Centers": centers,
      "Parks": parks,
      "Districts": districts
    }

    tiles.addTo(map);

    tracts.eachLayer(layer => FeatureHelper.mapLayerData(LayerFeatureType.TRACT, layer));
    zipCodes.eachLayer(layer => FeatureHelper.mapLayerData(LayerFeatureType.ZIP_CODE, layer));
    districts.eachLayer(layer => FeatureHelper.mapLayerData(LayerFeatureType.DISTRICT, layer));

    parks.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.PARK, layer));
    libraries.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.LIBRARY, layer));
    centers.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.COMMUNITY_CENTER, layer));

    districts.removeFrom(map);

    this.fetchMapPopulationData(map).subscribe((maxStats) => {
      const baseLayers = {
        'ZIP Codes': zipCodes,
        'Tracts': tracts
      }

      L.control.layers(baseLayers, overlayLayers, {collapsed: false}).addTo(map);

      LayerHelper.stylizePopulationLayer(zipCodes, maxStats);
      LayerHelper.stylizePopulationLayer(tracts, maxStats);
      LayerHelper.stylizeDistrictLayer(districts);

      tracts.removeFrom(map);

      this.bindDistrictLabels(districts, map);
      this.isLoading = false;
    });
  }

  /**
   * Fetch the population stats and append them to the feature (geometry) properties
   * @param map - Leaflet map
   * @private
   */
  private fetchMapPopulationData(map: L.Map) {
    const requestItems: GeoDataRequest[] = [];
    const districts: GeoLayer[] = (this.districtsGeoJSON as GeoJSON).getLayers() as unknown as GeoLayer[];

    map.eachLayer(rawLayer => {
      const layer = rawLayer as unknown as GeoLayer;
      const feature = layer.feature;

      if (!!feature && !!feature.properties) {
        const layerFeature = feature.properties as LayerFeature;

        if (layerFeature instanceof ZipcodeFeature || layerFeature instanceof TractFeature) {
          if (layerFeature instanceof TractFeature) {
            layerFeature.updateDistrict(districts.find(d => d._bounds.contains(layer._bounds)));
          }

          requestItems.push({
            layer: rawLayer,
            feature: layerFeature
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

  /**
   * Add callout labels to the district labels
   * @param feature - L.GeoJSON (tracts/zipCodes)
   * @param map
   * @private
   */
  private bindDistrictLabels(feature: L.GeoJSON, map: L.Map) {
    feature.eachLayer(rawLayer => {
      const layer = rawLayer as unknown as GeoLayer;
      if (!!layer.feature.properties) {
        const district: DistrictFeature = layer.feature.properties as DistrictFeature;

        rawLayer.bindTooltip(
            `District ${district.id}`,
          {
            permanent: true,
            direction: 'auto',
            offset: [-100, 0],
            className: `district-label map-geo-label ${map.getZoom() < 12 ? 'hide' : 'show'}`
          });
      }
    })
  }

}
