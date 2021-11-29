import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './pages';
import {WorksCitedComponent} from "./pages/works-cited/works-cited.component";


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'works-cited', component: WorksCitedComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
