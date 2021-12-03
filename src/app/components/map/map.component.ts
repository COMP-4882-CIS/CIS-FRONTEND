import * as L from 'leaflet';
import {AfterViewInit, Component, EventEmitter, Output} from '@angular/core';
import {GeoJSON, LeafletEvent, PopupEvent} from 'leaflet';
import {map as rxMap, switchMap, tap} from "rxjs/operators";
import {Feature} from "geojson";
import {FeatureHelper, LayerHelper, PopupHelper} from "../../helpers";
import {DistrictFeature, LayerFeature, TractFeature, ZipcodeFeature} from "../../backend/types/geo/features/layer";
import {LayerFeatureType} from "../../backend/types/geo/features/layer/layer-feature-type.enum";
import {PointFeatureType} from "../../backend/types/geo/features/point/point-feature-type.enum";
import {GeoTractService, StatService} from "../../backend/services";
import {GeoDataRequest} from "../../backend/requests/geo";
import {GeoEvent, GeoLayer} from "../../backend/types/geo";
import {PointFeature} from "../../backend/types/geo/features/point";
import 'src/assets/leaflet/SmoothWheelZoom.js';
import {environment} from "../../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        animate(300, style({ opacity: 0 }))
      ]),
    ])
  ]
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
  private schoolsGeoJSON?: GeoJSON;

  private popupOpen = false;
  private map?: L.Map;
  private shouldReload = false;

  constructor(private geoTractService: GeoTractService,
              private statService: StatService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {

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

    this.activatedRoute.queryParamMap.subscribe(params => {
      if (params.has('reload')) {
        this.shouldReload = (params.get('reload') === 'true');
        this.router.navigate([]).then();
      }
    })
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

    this.districtsGeoJSON = L.geoJSON()
      .bindPopup(layer => PopupHelper.bindLayerPopup(LayerFeatureType.DISTRICT, layer))
      .addTo(this.map);

    this.tractsGeoJSON = L.geoJSON()
      .bindPopup(layer => PopupHelper.bindLayerPopup(LayerFeatureType.TRACT, layer))
      .addTo(this.map);

    this.zipCodesGeoJSON = L.geoJSON()
      .bindPopup(layer => PopupHelper.bindLayerPopup(LayerFeatureType.ZIP_CODE, layer))
      .addTo(this.map);

    this.parksGeoJSON = FeatureHelper.createGeoJSON(PointFeatureType.PARK, this.map);
    this.librariesGeoJSON = FeatureHelper.createGeoJSON(PointFeatureType.LIBRARY, this.map);
    this.centersGeoJSON = FeatureHelper.createGeoJSON(PointFeatureType.COMMUNITY_CENTER, this.map);
    this.schoolsGeoJSON = FeatureHelper.createGeoJSON(PointFeatureType.SCHOOL, this.map);

    this.fetchMapData(this.map);
    this.attachEvents(this.map);

    if (this.shouldReload) {
      this.resizeMap(0);
      this.shouldReload = false;
    }
  }

  /**
   * Resize the Leaflet map container
   *
   * Internally calls invalidate size after ensuring the L.map object is defined
   * @private
   */
  private resizeMap(waitTime = 350) {
    setTimeout(() => {
      if (!!this.map) {
        this.map.invalidateSize({animate: true});
      }
    }, waitTime);
  }

  /**
   * Attach the popup events to an L.map object
   *
   * @param map - L.Map
   * @private
   */
  private attachEvents(map: L.Map) {
    const parks: GeoJSON = this.parksGeoJSON!;
    const libraries: GeoJSON = this.librariesGeoJSON!;
    const centers: GeoJSON = this.centersGeoJSON!;
    const schools: GeoJSON = this.schoolsGeoJSON!;

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

    parks.on('click', (event) => this.handleFeatureClick(event));
    centers.on('click', (event) => this.handleFeatureClick(event));
    libraries.on('click', (event) => this.handleFeatureClick(event));
    schools.on('click', (event) => this.handleFeatureClick(event));
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
      const schools = this.schoolsGeoJSON as GeoJSON;

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
        tap(f => centers.addData(f)),
        switchMap(() => this.geoTractService.getSchoolsFeatures()),
        tap(f => schools.addData(f))
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
    const schools = this.schoolsGeoJSON as GeoJSON;

    const tiles = L.tileLayer(environment.map.tiles, {
      maxZoom: 18,
      minZoom: 3,
      attribution: environment.map.attribution
    });

    const overlayLayers = {
      "Libraries": libraries,
      "Community Centers": centers,
      "Parks": parks,
      "Schools": schools,
      "Districts": districts,
    }

    tiles.addTo(map);

    tracts.eachLayer(layer => FeatureHelper.mapLayerData(LayerFeatureType.TRACT, layer));
    zipCodes.eachLayer(layer => FeatureHelper.mapLayerData(LayerFeatureType.ZIP_CODE, layer));
    districts.eachLayer(layer => FeatureHelper.mapLayerData(LayerFeatureType.DISTRICT, layer));

    parks.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.PARK, layer));
    libraries.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.LIBRARY, layer));
    centers.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.COMMUNITY_CENTER, layer));
    schools.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.SCHOOL, layer));

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

      setTimeout(() => {
        map.invalidateSize();
        this.isLoading =  false;
      }, 100);
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

  /**
   * Handle a click event on a feature
   * @param event
   * @private
   */
  private handleFeatureClick(event: LeafletEvent) {
    const feature: PointFeature = event.sourceTarget.feature.properties;

    setTimeout(() => {
      this.popupOpened.emit({
        type: feature.type,
        data: feature
      })
    }, 100);
  }

}
