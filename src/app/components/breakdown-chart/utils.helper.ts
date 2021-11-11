import colorLib, {Color} from '@kurkle/color';

export class Utils {
  static CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  };


  static isPatternOrGradient = (value: any) => value instanceof CanvasGradient || value instanceof CanvasPattern;

  static color(value: any): Color {
    return this.isPatternOrGradient(value) ? value : colorLib(value);
  }

  static getHoverColor(value: any) {
    return this.isPatternOrGradient(value)
      ? value
      : colorLib(value).saturate(0.5).darken(0.1).hexString();
  }
}
