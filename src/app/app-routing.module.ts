import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent, ZipcodeComponent} from './pages';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'zipcodes', component: ZipcodeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
