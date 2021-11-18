import {PointFeatureType} from "../backend/types/geo/features/feature-type.enum";
import {LibraryFeature} from "../backend/types/geo/features/library-feature.type";
import {CommunityCenterFeature} from "../backend/types/geo/features/community-center-feature.type";
import {PointFeature} from "../backend/types/geo/features/point-feature.type";
import {ParkFeature} from "../backend/types/geo/features/park-feature.type";

export class FeatureHelper {
  static mapRawDataToFeatureData(type: PointFeatureType, data: any): PointFeature {
    switch (type) {
      case PointFeatureType.LIBRARY:
        return new LibraryFeature(data)
      case PointFeatureType.COMMUNITY_CENTER:
        return new CommunityCenterFeature(data);
      case PointFeatureType.PARK:
        return new ParkFeature(data);
    }
  }
}
