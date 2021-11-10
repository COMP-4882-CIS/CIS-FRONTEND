import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent, ZipcodeComponent} from './pages';
import { PieChartOverviewComponent } from './pie-chart-overview/pie-chart-overview.component';



const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'zipcodes', component: ZipcodeComponent},
  {path: 'pie-chart-overview', component: PieChartOverviewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
