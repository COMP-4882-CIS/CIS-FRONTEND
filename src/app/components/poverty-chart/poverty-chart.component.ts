import {Component, Input} from '@angular/core';
import {ColorsHelper} from "../../helpers";
import {PovertyData} from "../../misc";

@Component({
  selector: 'app-poverty-chart',
  templateUrl: './poverty-chart.component.html',
  styleUrls: ['./poverty-chart.component.scss']
})
export class PovertyChartComponent {

  @Input() data!: PovertyData;

  @Input() set isMain(newValue: string|boolean) {
    if (typeof newValue === "boolean") {
      this.mainChart = newValue as boolean;
    } else {
      this.mainChart = true;
    }
  }

  mainChart = false;

  getChildrenColorStyle(data: PovertyData) {
    return this.getColorStyle(data.area + '-people-children');
  }

  getPeopleColorStyle(data: PovertyData) {
    return this.getColorStyle(data.area + '-people');
  }

  getColorStyle(key: string): { [key: string]: any } {
    const hexToRGB = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }

    const inverse = (hex: string) => {
      const rgb = hexToRGB(hex);
      if (rgb) {
        const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b);
        return (luminance < 140) ? '#ffffff' : '#000000';
      }

      return '#ffffff';
    }

    const backgroundColor = ColorsHelper.getIdentifiableHexColor(key);
    const color = inverse(backgroundColor);

    return {
      'background-color': backgroundColor,
      color
    }
  }

  getWidth(percentage: number): string {
    return `${percentage}%`;
  }

  getChildWidth(data: PovertyData): string {
    return this.getWidth(data.childrenPercentage * 2);
  }

  getPeopleWidth(data: PovertyData): string {
    return this.getWidth(data.peoplePercentage * 2);
  }

}
