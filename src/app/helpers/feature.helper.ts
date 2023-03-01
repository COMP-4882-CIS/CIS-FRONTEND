import {PointFeatureType} from "../backend/types/geo/features/point/point-feature-type.enum";
import {GeoLayer} from "../backend/types/geo";
import {LatLng, Layer} from "leaflet";
import {
  CommunityCenterFeature,
  LibraryFeature,
  ParkFeature,
  PointFeature,
  SchoolFeature,
  CCCFeature,
  CCFFeature,
  CAFeature,
  CBRFeature,
  CDFeature,
  CTFeature,
  COFeature,
  CWFeature,
  HealthFeature,
  SearchFeature,
  SickFeature,
  LEAD0Feature,
  LEAD1Feature,
  LEAD2Feature,
  LEAD3Feature,
  LEAD4Feature,
  LEAD5Feature,
  LEAD6Feature,
} from "../backend/types/geo/features/point";
import {DistrictFeature, LayerFeature, TractFeature, ZipcodeFeature} from "../backend/types/geo/features/layer";
import {LayerFeatureType} from "../backend/types/geo/features/layer/layer-feature-type.enum";
import {Feature, Geometry} from "geojson";
import * as L from "leaflet";
import {TooltipHelper} from "./tooltip.helper";

export class FeatureHelper {

  static geoJSONOptions = (type: PointFeatureType, map: L.Map, animate: boolean = true): L.GeoJSONOptions => {
    if (type === PointFeatureType.PARK) {
      return {
        pointToLayer: (_, coordinates) => FeatureHelper.getMarkerIcon(type, coordinates, map, animate),
        filter: (geoJsonFeature: Feature<Geometry, any>) => {
          return FeatureHelper.parkHasParkName(geoJsonFeature)
        }
      }
    } else {
      return {
        pointToLayer: (_, coordinates) => FeatureHelper.getMarkerIcon(type, coordinates, map, animate)
      }
    }
  };

  static icons = {
    default: L.icon({
      iconUrl: 'assets/icons/default.png',
      iconSize: [31, 42],
    }),
    library: L.icon({
      iconUrl: 'assets/icons/library.png',
      iconSize: [31, 42],
    }),
    park: L.icon({
      iconUrl: 'assets/icons/park.png',
      iconSize: [31, 42],
    }),
    center: L.icon({
      iconUrl: 'assets/icons/community_center.png',
      iconSize: [31, 42],
    }),
    CCC: L.icon({
      iconUrl: 'assets/icons/childcare.svg',
      iconSize: [31, 42],
    }),
    CCF: L.icon({
      iconUrl: 'assets/icons/childcare.svg',
      iconSize: [31, 42],
    }),
    CA: L.icon({
      iconUrl: 'assets/icons/assault.svg',
      iconSize: [31, 42],
    }),
    CBR: L.icon({
      iconUrl: 'assets/icons/burg.svg',
      iconSize: [31, 42],
    }),
    CD: L.icon({
      iconUrl: 'assets/icons/drugs.svg',
      iconSize: [31, 42],
    }),
    CT: L.icon({
      iconUrl: 'assets/icons/theft.svg',
      iconSize: [31, 42],
    }),
    CO: L.icon({
      iconUrl: 'assets/icons/other.svg',
      iconSize: [31, 42],
    }),
    CW: L.icon({
      iconUrl: 'assets/icons/weapon.svg',
      iconSize: [31, 42],
    }),
    school: L.icon({
      iconUrl: 'assets/icons/school.png',
      iconSize: [31, 42],
    }),
    HC: L.icon({
      iconUrl: 'assets/icons/search.png',
      iconSize: [31, 42],
    }),
    SEARCH: L.icon({
      iconUrl: 'assets/icons/searchL.png',
      iconSize: [0, 0],
    }),
    SICK: L.icon({
      iconUrl: 'assets/icons/search.png',
      iconSize: [31, 42],
    }),
    LEAD0: L.icon({
      iconUrl: 'assets/icons/search.png',
      iconSize: [31, 42],
    }),
    LEAD1: L.icon({
      iconUrl: 'assets/icons/search.png',
      iconSize: [31, 42],
    }),
    LEAD2: L.icon({
      iconUrl: 'assets/icons/search.png',
      iconSize: [31, 42],
    }),
    LEAD3: L.icon({
      iconUrl: 'assets/icons/search.png',
      iconSize: [31, 42],
    }),
    LEAD4: L.icon({
      iconUrl: 'assets/icons/search.png',
      iconSize: [31, 42],
    }),
    LEAD5: L.icon({
      iconUrl: 'assets/icons/search.png',
      iconSize: [31, 42],
    }),
    LEAD6: L.icon({
      iconUrl: 'assets/icons/search.png',
      iconSize: [31, 42],
    }),
  }

  static createGeoJSON(type: PointFeatureType, map: L.Map, animate: boolean = true): L.GeoJSON {
    return L.geoJSON(undefined, this.geoJSONOptions(type, map, animate))
      .bindTooltip(layer => TooltipHelper.bindPointTooltip(layer), {
        className: (animate ? 'anim-tooltip' : '')
      }).addTo(map);
  }

  static getMarkerIcon(type: PointFeatureType, coordinates: LatLng, map: L.Map, animate: boolean = true): L.Marker {
    let icon: L.DivIcon = this.icons.default;

    switch (type) {
      case PointFeatureType.LIBRARY:
        icon = this.icons.library;
        break
      case PointFeatureType.PARK:
        icon = this.icons.park;
        break;
      case PointFeatureType.COMMUNITY_CENTER:
        icon = this.icons.center;
        break;
      case PointFeatureType.CCC:
        icon = this.icons.CCC;
        break;
      case PointFeatureType.CCF:
        icon = this.icons.CCF;
        break;
      case PointFeatureType.CA:
        icon = this.icons.CA;
        break;
      case PointFeatureType.CBR:
        icon = this.icons.CBR;
        break;
      case PointFeatureType.CD:
        icon = this.icons.CD;
        break;
      case PointFeatureType.CT:
        icon = this.icons.CT;
        break;
      case PointFeatureType.CO:
        icon = this.icons.CO;
        break;
      case PointFeatureType.CW:
        icon = this.icons.CW;
        break;
      case PointFeatureType.SCHOOL:
        icon = this.icons.school;
        break;
      case PointFeatureType.HC:
        icon = this.icons.HC;
        break;
      case PointFeatureType.SEARCH:
        icon = this.icons.SEARCH;
        break;
      case PointFeatureType.SICK:
        icon = this.icons.SICK;
        break;
      case PointFeatureType.LEAD0:
        icon = this.icons.LEAD0;
        break;
      case PointFeatureType.LEAD1:
        icon = this.icons.LEAD1;
        break;
      case PointFeatureType.LEAD2:
        icon = this.icons.LEAD2;
        break;
      case PointFeatureType.LEAD3:
        icon = this.icons.LEAD3;
        break;
      case PointFeatureType.LEAD4:
        icon = this.icons.LEAD4;
        break;
      case PointFeatureType.LEAD5:
        icon = this.icons.LEAD5;
        break;
      case PointFeatureType.LEAD6:
        icon = this.icons.LEAD6;
        break;
      
    }

    const marker = L.marker(coordinates, {icon, riseOnHover: true, riseOffset: 10});

    if (animate) {
      return this.attachTooltipEvents(marker, map);
    }

    return marker;
  }

  static mapRawDataToFeatureData(type: PointFeatureType, data: any): PointFeature {
    switch (type) {
      case PointFeatureType.LIBRARY:
        return new LibraryFeature(data)
      case PointFeatureType.COMMUNITY_CENTER:
        return new CommunityCenterFeature(data);
      case PointFeatureType.PARK:
        return new ParkFeature(data);
      case PointFeatureType.SCHOOL:
        return new SchoolFeature(data);
      case PointFeatureType.CCF:
        return new CCFFeature(data);
      case PointFeatureType.CCC:
        return new CCCFeature(data);
      case PointFeatureType.CA:
        return new CAFeature(data);
      case PointFeatureType.CBR:
        return new CBRFeature(data);
      case PointFeatureType.CD:
        return new CDFeature(data);
      case PointFeatureType.CT:
        return new CTFeature(data);
      case PointFeatureType.CO:
        return new COFeature(data);
      case PointFeatureType.CW:
        return new CWFeature(data);
      case PointFeatureType.HC:
        return new HealthFeature(data);
      case PointFeatureType.SEARCH:
        return new SearchFeature(data);
      case PointFeatureType.SICK:
        return new SickFeature(data);
      case PointFeatureType.LEAD0:
        return new LEAD0Feature(data);
      case PointFeatureType.LEAD1:
        return new LEAD1Feature(data);
      case PointFeatureType.LEAD2:
        return new LEAD2Feature(data);
      case PointFeatureType.LEAD3:
        return new LEAD3Feature(data);
      case PointFeatureType.LEAD4:
        return new LEAD4Feature(data);
      case PointFeatureType.LEAD5:
        return new LEAD5Feature(data);
      case PointFeatureType.LEAD6:
        return new LEAD6Feature(data);

    }
  }

  static mapRawDataToLayerData(type: LayerFeatureType, data: any): LayerFeature {
    switch (type) {
      case LayerFeatureType.ZIP_CODE:
        return new ZipcodeFeature(data);
      case LayerFeatureType.TRACT:
        return new TractFeature(data);
      case LayerFeatureType.DISTRICT:
        return new DistrictFeature(data);
    }
  }

  static mapFeatureLayerData(type: PointFeatureType, leafletLayer: Layer) {
    const layer = leafletLayer as unknown as GeoLayer;

    if (!!layer.feature.properties) {
      layer.feature.properties = this.mapRawDataToFeatureData(type, layer.feature.properties);
    }
  }

  static mapLayerData(type: LayerFeatureType, leafletLayer: Layer) {
    const layer = leafletLayer as unknown as GeoLayer;

    if (!!layer.feature.properties) {
      layer.feature.properties = this.mapRawDataToLayerData(type, layer.feature.properties);
    }
  }

  private static parkHasParkName(feature: Feature<Geometry, any>): boolean {
    return feature.properties.hasOwnProperty('park_nam_1') && !!feature.properties.park_nam_1;
  }

  private static attachTooltipEvents(marker: L.Marker, map: L.Map): L.Marker {
    return marker.on('tooltipopen', (event) => {
      TooltipHelper.handleTooltipOpen(event.sourceTarget['_icon']);
    }).on('tooltipclose', (event) => {
      TooltipHelper.handleTooltipClose(event.sourceTarget['_icon'])
    }).on('click', (event) => {
      map.setView((event as any)['latlng'], (map.getZoom() <= 13 ? 13 : undefined));
    })
  }
}
