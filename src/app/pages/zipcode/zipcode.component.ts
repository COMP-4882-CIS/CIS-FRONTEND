import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-zipcode',
  templateUrl: './zipcode.component.html',
  styleUrls: ['./zipcode.component.scss']
})

export class ZipcodeComponent implements OnInit {

  zipcodes: Observable<string[]>;

  constructor(private httpClient: HttpClient) {
    this.zipcodes = this.httpClient.get<any[]>('https://data.memphistn.gov/resource/98jk-gvpk.json').pipe(
      map(r => r.map(item => item['name']))
    );
  }

  ngOnInit() {
  }
}






