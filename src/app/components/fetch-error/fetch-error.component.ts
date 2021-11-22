import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-fetch-error',
  templateUrl: './fetch-error.component.html',
  styleUrls: ['./fetch-error.component.scss']
})
export class FetchErrorComponent implements OnInit {

  @Input()
  statType!: string;

  @Input()
  detailMessage?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
