import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent, PovertyLevelComponent} from './pages';
import {WorksCitedComponent} from "./pages";


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'works-cited', component: WorksCitedComponent},
  {path: 'poverty-level', component: PovertyLevelComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
