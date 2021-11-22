import {DataSourceType} from "./data-source-type.enum";

export interface DataSource {
  type: DataSourceType;
  topic: string;
  url: string;
  description: string;
}
