import ColorHash from 'color-hash'

export class ColorsHelper {
  private static colorHash = new ColorHash();

  static featureMarkerColors = {
    library: '#0075F2',
    park: '#09E85E',
    center: '#7F7EFF'
  }

  static getIdentifiableHexColor(identifier: string): string {
    return this.colorHash.hex(identifier);
  }
}
