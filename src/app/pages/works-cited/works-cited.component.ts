import {Component} from '@angular/core';
import {DataSource} from "./types/data-source.type";
import {worksCitedData} from "./data/works-cited.data";
import {DataSourceType} from "./types/data-source-type.enum";
import {Title} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-works-cited',
  templateUrl: './works-cited.component.html',
  styleUrls: ['./works-cited.component.scss']
})
export class WorksCitedComponent {

  appTitle: string;
  worksCited: DataSource[] = worksCitedData;
  worksCitedTypes: DataSourceType[] = [...new Set(this.worksCited.map(d => d.type))];

  constructor(private title: Title) {
    this.appTitle = environment.appTitle;
    this.title.setTitle('Child Impact Statements: Works Cited');
  }

  getByType(type: DataSourceType) {
    return this.worksCited.filter(d => d.type === type);
  }

  print() {
    window.print();
  }
}
