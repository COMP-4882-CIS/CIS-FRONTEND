import {PointFeatureType} from "../backend/types/geo/features/point/point-feature-type.enum";
import {GeoLayer} from "../backend/types/geo";
import {LatLng, Layer} from "leaflet";
import {
  CommunityCenterFeature,
  LibraryFeature,
  ParkFeature,
  PointFeature,
  SchoolFeature
} from "../backend/types/geo/features/point";
import {DistrictFeature, LayerFeature, TractFeature, ZipcodeFeature} from "../backend/types/geo/features/layer";
import {LayerFeatureType} from "../backend/types/geo/features/layer/layer-feature-type.enum";
import {Feature, Geometry} from "geojson";
import * as L from "leaflet";

export class FeatureHelper {

  static geoJSONOptions = (type: PointFeatureType): L.GeoJSONOptions => {
    if (type === PointFeatureType.PARK) {
      return {
        pointToLayer: (_, coordinates) => FeatureHelper.getMarkerIcon(type, coordinates),
        filter: (geoJsonFeature: Feature<Geometry, any>) => {
          return FeatureHelper.parkHasParkName(geoJsonFeature)
        }
      }
    } else {
      return {
        pointToLayer: (_, coordinates) => FeatureHelper.getMarkerIcon(type, coordinates)
      }
    }
  };

  static icons = {
    default: L.icon({
      iconUrl: 'assets/icons/default.png',
      iconSize: [31, 42],
    }),
    library:  L.icon({
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
    school: L.icon({
      iconUrl: 'assets/icons/school.png',
      iconSize: [31, 42],
    })
  }

  static createGeoJSON(type: PointFeatureType): L.GeoJSON {
    return L.geoJSON(undefined, this.geoJSONOptions(type))
  }

  static getMarkerIcon(type: PointFeatureType, coordinates: LatLng): L.Marker {
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
      case PointFeatureType.SCHOOL:
        icon = this.icons.school;
        break;
    }

    return L.marker(coordinates, {icon, riseOnHover: true});
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
}
