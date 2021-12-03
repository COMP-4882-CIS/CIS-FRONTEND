import {Component} from '@angular/core';
import {PovertyData, PovertyScheduleData} from "../../misc";

@Component({
  selector: 'app-poverty-level',
  templateUrl: './poverty-level.component.html',
  styleUrls: ['./poverty-level.component.scss']
})
export class PovertyLevelComponent {

  povertySchedule: PovertyScheduleData[] = [
    {povertyGuideline: 12880, personInFamily: 1},
    {povertyGuideline: 17420, personInFamily: 2},
    {povertyGuideline: 21960, personInFamily: 3},
    {povertyGuideline: 26500, personInFamily: 4},
    {povertyGuideline: 31040, personInFamily: 5},
    {povertyGuideline: 35580, personInFamily: 6},
    {povertyGuideline: 40120, personInFamily: 7},
    {povertyGuideline: 44660, personInFamily: 8},
  ];

  shelbyCountyPoverty: PovertyData = {
    area: 'Shelby County, TN',
    peoplePercentage: 16.8,
    childrenPercentage: 25.9
  };

  povertyData: PovertyData[] = [
    {
      area: 'Memphis, TN',
      peoplePercentage: 21.7,
      childrenPercentage: 35
    },
    {
      area: 'Collierville, TN',
      peoplePercentage: 3.9,
      childrenPercentage: 6
    },
    {
      area: 'Germantown, TN',
      peoplePercentage: 2.5,
      childrenPercentage: 2
    },
    {
      area: 'Bartlett, TN',
      peoplePercentage: 6.2,
      childrenPercentage: 10
    },
    {
      area: 'Arlington, TN',
      peoplePercentage: 3,
      childrenPercentage: 3
    },
    {
      area: 'Millington, TN',
      peoplePercentage: 18.6,
      childrenPercentage: 27
    },
  ]

}
