import * as L from 'leaflet';

declare module 'leaflet' {
  namespace IconMaterial {
   interface IconMaterialOptions {
     icon?: string,
     iconColor?: string
     markerColor?: string,
     outlineColor?: string,
     outlineWidth?: number,
     iconSize?: number[]
   }

   function icon(options: IconMaterialOptions): L.DivIcon;
   function Icon(): L.DivIcon;
  }
}
