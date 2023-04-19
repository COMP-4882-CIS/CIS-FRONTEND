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
import 'leaflet/dist/leaflet.css';
import {environment} from "../../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";
import {animate, style, transition, trigger} from "@angular/animations";
import 'leaflet.control.layers.tree';
import 'leaflet-search';
import 'leaflet-control-geocoder';
import 'leaflet-search/src/leaflet-search.js';
import 'leaflet-search/src/leaflet-search.css';
import {Geocoder, geocoders} from 'leaflet-control-geocoder';
import {Search} from 'leaflet-search';
import 'leaflet-ruler';
import 'leaflet.markercluster';
import { isNullOrUndefined } from 'util';


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
  private CCFGeoJSON?: GeoJSON;
  private CCCGeoJSON?: GeoJSON;
  private CAGeoJSON?: GeoJSON;
  private CBRGeoJSON?: GeoJSON;
  private CDGeoJSON?: GeoJSON;
  private CTGeoJSON?: GeoJSON;
  private COGeoJSON?: GeoJSON;
  private CWGeoJSON?: GeoJSON;
  // private HCGeoJSON?: GeoJSON;
  private SEARCHGeoJSON?: GeoJSON;

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
    this.CCFGeoJSON = FeatureHelper.createGeoJSON(PointFeatureType.CCF, this.map);
    this.CCCGeoJSON = FeatureHelper.createGeoJSON(PointFeatureType.CCC, this.map);
    this.CAGeoJSON = FeatureHelper.createGeoJSON(PointFeatureType.CA, this.map);
    this.CBRGeoJSON = FeatureHelper.createGeoJSON(PointFeatureType.CBR, this.map);
    this.CDGeoJSON = FeatureHelper.createGeoJSON(PointFeatureType.CD, this.map);
    this.CTGeoJSON = FeatureHelper.createGeoJSON(PointFeatureType.CT, this.map);
    this.COGeoJSON = FeatureHelper.createGeoJSON(PointFeatureType.CO, this.map);
    this.CWGeoJSON = FeatureHelper.createGeoJSON(PointFeatureType.CW, this.map);
    // this.HCGeoJSON = FeatureHelper.createGeoJSON(PointFeatureType.HC, this.map);
    this.SEARCHGeoJSON = FeatureHelper.createGeoJSON(PointFeatureType.SEARCH, this.map);
    

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
    const zipcode: GeoJSON = this.zipCodesGeoJSON!;
    const parks: GeoJSON = this.parksGeoJSON!;
    const libraries: GeoJSON = this.librariesGeoJSON!;
    const centers: GeoJSON = this.centersGeoJSON!;
    const schools: GeoJSON = this.schoolsGeoJSON!;
    const ccf: GeoJSON = this.CCFGeoJSON!;
    const ccc: GeoJSON = this.CCCGeoJSON!;
    const ca: GeoJSON = this.CAGeoJSON!;
    const cbr: GeoJSON = this.CBRGeoJSON!;
    const cd: GeoJSON = this.CDGeoJSON!;
    const ct: GeoJSON = this.CTGeoJSON!;
    const co: GeoJSON = this.COGeoJSON!;
    const cw: GeoJSON = this.CWGeoJSON!;
    // const hc: GeoJSON = this.HCGeoJSON!;
    const search: GeoJSON = this.SEARCHGeoJSON!;
    
    
  
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
    ccc.on('click', (event) => this.handleFeatureClick(event));
    ccf.on('click', (event) => this.handleFeatureClick(event));
    ca.on('click', (event) => this.handleFeatureClick(event));
    cbr.on('click', (event) => this.handleFeatureClick(event));
    cd.on('click', (event) => this.handleFeatureClick(event));
    ct.on('click', (event) => this.handleFeatureClick(event));
    co.on('click', (event) => this.handleFeatureClick(event));
    cw.on('click', (event) => this.handleFeatureClick(event));
    // hc.on('click', (event) => this.handleFeatureClick(event));
    search.on('click', (event) => this.handleFeatureClick(event));
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
      const ccf = this.CCFGeoJSON as GeoJSON;
      const ccc = this.CCCGeoJSON as GeoJSON;
      const ca = this.CAGeoJSON as GeoJSON;
      const cbr = this.CBRGeoJSON as GeoJSON;
      const cd = this.CDGeoJSON as GeoJSON;
      const ct = this.CTGeoJSON as GeoJSON;
      const co = this.COGeoJSON as GeoJSON;
      const cw = this.CWGeoJSON as GeoJSON;
      // const hc = this.HCGeoJSON as GeoJSON;
      const search = this.SEARCHGeoJSON as GeoJSON;

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
        tap(f => schools.addData(f)),
        switchMap(() => this.geoTractService.getCCFFeatures()),
        tap(f => ccf.addData(f)),
        switchMap(() => this.geoTractService.getCCCFeatures()),
        tap(f => ccc.addData(f)),
        switchMap(() => this.geoTractService.getCAFeatures()),
        tap(f => ca.addData(f)),
        switchMap(() => this.geoTractService.getCBRFeatures()),
        tap(f => cbr.addData(f)),
        switchMap(() => this.geoTractService.getCDFeatures()),
        tap(f => cd.addData(f)),
        switchMap(() => this.geoTractService.getCTFeatures()),
        tap(f => ct.addData(f)),
        switchMap(() => this.geoTractService.getCOFeatures()),
        tap(f => co.addData(f)),
        switchMap(() => this.geoTractService.getCWFeatures()),
        tap(f => cw.addData(f)),
        // switchMap(() => this.geoTractService.getHealthFeatures()),
        // tap(f => hc.addData(f)),
        switchMap(() => this.geoTractService.getSearchFeatures()),
        tap(f => search.addData(f)),

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
    const ccf = this.CCFGeoJSON as GeoJSON;
    const ccc = this.CCCGeoJSON as GeoJSON;
    const ca = this.CAGeoJSON as GeoJSON;
    const cbr = this.CBRGeoJSON as GeoJSON;
    const cd = this.CDGeoJSON as GeoJSON;
    const ct = this.CTGeoJSON as GeoJSON;
    const co = this.COGeoJSON as GeoJSON;
    const cw = this.CWGeoJSON as GeoJSON;
    // const hc = this.HCGeoJSON as GeoJSON;
    const search = this.SEARCHGeoJSON as GeoJSON;
    

    const tiles = L.tileLayer(environment.map.tiles, {
      maxZoom: 18,
      minZoom: 3,
      attribution: environment.map.attribution
    });

    tiles.addTo(map);

    tracts.eachLayer(layer => FeatureHelper.mapLayerData(LayerFeatureType.TRACT, layer));
    zipCodes.eachLayer(layer => FeatureHelper.mapLayerData(LayerFeatureType.ZIP_CODE, layer));
    districts.eachLayer(layer => FeatureHelper.mapLayerData(LayerFeatureType.DISTRICT, layer));

    parks.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.PARK, layer));
    libraries.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.LIBRARY, layer));
    centers.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.COMMUNITY_CENTER, layer));
    schools.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.SCHOOL, layer));
    ccc.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.CCC, layer));
    ccf.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.CCF, layer));
    ca.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.CA, layer));
    cbr.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.CBR, layer));
    cd.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.CD, layer));
    ct.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.CT, layer));
    co.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.CO, layer));
    cw.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.CW, layer));
    // hc.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.HC, layer));
    search.eachLayer(layer => FeatureHelper.mapFeatureLayerData(PointFeatureType.SEARCH, layer));
    

    districts.removeFrom(map);

    //Create clusters by category (for filtering by categoory)
    // const camarkers = L.markerClusterGroup();
    // camarkers.addLayer(ca);
    // const cbrmarkers = L.markerClusterGroup();
    // cbrmarkers.addLayer(cbr);
    // const cdmarkers = L.markerClusterGroup();
    // cdmarkers.addLayer(cd);
    // const ctmarkers = L.markerClusterGroup();
    // ctmarkers.addLayer(ct);
    // const comarkers = L.markerClusterGroup();
    // comarkers.addLayer(co);
    // const cwmarkers = L.markerClusterGroup();
    // cwmarkers.addLayer(cw);

    //Group categories together for clustering on map
    const crimemarkers = L.markerClusterGroup();
    crimemarkers.addLayers([ca,cbr,cd,ct,co,cw]);
    
    //Removing unclustered icons from map
    ca.removeFrom(map);
    cbr.removeFrom(map);
    cd.removeFrom(map);
    ct.removeFrom(map);
    co.removeFrom(map);
    cw.removeFrom(map);

    this.fetchMapPopulationData(map).subscribe((maxStats) => {


      // how the checkboxes are made
      var baseTree = {
        label: 'Resources',
        noShow: false,
        children: [
            {
                label: 'Schools',
                layer: schools,
            },
            {
                label: 'Child Care',
                selectAllCheckbox: true,
                children: [
                    {label: 'Child-Care Homes', layer: ccf},
                    {label: 'Child-Care Centers', layer: ccc},
                ]
            },
            //If we decide to allow filtering by category
            // {
            // label: 'Crime',
            //  selectAllCheckbox: true,
            //   children: [
            //       {label: 'Assaults', layer: camarkers},
            //       {label: 'Burglary/Robbery', layer: cbrmarkers},
            //       {label: 'Drug Violations', layer: cdmarkers},
            //       {label: 'Thefts', layer: ctmarkers},
            //       {label: 'Traffic/Other', layer: comarkers},
            //       {label: 'Weapon Violations', layer: cwmarkers},
              
            //   ]
            // },
            {
              label: 'Parks',
              layer: parks,
          },
          {
            label: 'Community Centers',
            layer: centers,
        },
        {
          label: 'Libraries',
          layer: libraries,
        },
        // If you want hospitals added uncomment all code for 'hc'
        // {
        //   label: 'Hospitals',
        //   layer: hc,
        // },
        {
          label: 'Crimes',
          layer: crimemarkers,

        },
        ]
      };

      // tree for View By
      var secondTree = {
          label: 'View By',
          children: [
            { label: 'Zip Codes', layer: zipCodes },
            { label: 'Tracts', layer: tracts },
            { label: 'Districts', layer: districts },
          ]
      }


      /*
      // creating bounds for search
      var corner1 = L.latLng(35.246416, -90.082607),
      corner2 = L.latLng(34.977927, -89.565905),
      bounds = L.latLngBounds(corner1, corner2)
      */
      /*
      // geocoder, used to search addresses
      new Geocoder({
        geocoder: new geocoders.Nominatim({
          geocodingQueryParams: {
            "viewbox" : bounds.toBBoxString(),
            'bounded':1
          }
        }),
        position: 'topleft',
        defaultMarkGeocode: false,
      }).on('markgeocode', function(e :any){
          var bbox = e.geocode.bbox;
          var poly = L.polygon([
            bbox.getSouthEast(),
            bbox.getNorthEast(),
            bbox.getNorthWest(),
            bbox.getSouthWest(),
          ]).addTo(map);
          map.fitBounds(poly.getBounds());
      })
      .addTo(map);

      */

      var poiLayers = L.layerGroup([
        libraries,
        centers,
        parks,
        schools,
        ccf,
        ccc,
        // hc,
        search,
      ])

      // used to create search for geojson data files, searching by name
      const searchControl = new L.Control.Search({
        layer: poiLayers,
        propertyName: 'displayName',
        marker: false,
        autoType: false,
        zoom: 16
      });
      (searchControl as any).on('search:locationfound', function (e :any) {
          if (e.layer._popup) e.layer.openPopup().openOn(map);
        });

      map.addControl(searchControl);
    
  
      // used to create marker clusters
      // const markers = L.markerClusterGroup();
      // markers.addLayers([ca,cbr,cd,ct,co,cw]);
      // markers.addTo(map);

      // adding the checkboxes
      var ctl = L.control.layers.tree(secondTree, baseTree, {
        namedToggle: true,
        collapsed: false,});
      ctl.addTo(map).collapseTree().expandSelected().collapseTree(true);
      
      LayerHelper.stylizePopulationLayer(zipCodes, maxStats);
      LayerHelper.stylizePopulationLayer(tracts, maxStats);
      LayerHelper.stylizeDistrictLayer(districts);

      tracts.removeFrom(map);

      this.bindDistrictLabels(districts, map);
      this.bindZipcodeLabels(zipCodes, map);

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


/**
   * Add callout labels to the zipcode labels
   * @param feature - L.GeoJSON (tracts/zipCodes)
   * @param map
   * @private
   */
private bindZipcodeLabels(feature: L.GeoJSON, map: L.Map) {
 feature.eachLayer(rawLayer => {
   const layer = rawLayer as unknown as GeoLayer;
   if (!!layer.feature.properties) {
     const zipcode: ZipcodeFeature = layer.feature.properties as ZipcodeFeature;

     rawLayer.bindTooltip(
       `Zipcode ${zipcode.id}`,
       {
         permanent: false,
         direction: 'auto',
         offset: [-15, 0],
         className: `zipcode-label map-geo-label ${map.getZoom() < 0 ? 'hide' : 'show'}`
       });
   }
 })
}
}
