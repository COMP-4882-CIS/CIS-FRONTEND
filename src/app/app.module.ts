import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatDividerModule} from "@angular/material/divider";
import {NgChartsModule} from 'ng2-charts';
import {MatTabsModule} from "@angular/material/tabs";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatTableModule} from "@angular/material/table";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatMenuModule} from "@angular/material/menu";
import {MatExpansionModule} from '@angular/material/expansion';
import {HomeComponent, PovertyLevelComponent, WorksCitedComponent} from "./pages";
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { CovidBreakdownSummaryComponent } from './components/covid-breakdown-summary/covid-breakdown-summary.component';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { LeadGraphsComponent } from './components/lead-graphs/lead-graphs.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { CovidGraphsComponent } from './components/covid-graphs/covid-graphs.component';
import { MapFeaturesGraphsComponent } from './components/mapfeatures-graphs/mapfeatures-graphs.component';
import { MapResourceGraphsComponent } from './components/mapresource-graphs/mapresource-graphs.component';
import { GraphsPageComponent } from './components/graphs-page/graphs-page.component';
import {
  BreakdownChartComponent,
  BreakdownSummaryComponent, FetchErrorComponent,
  MapBoxComponent,
  MapComponent, MapSidebarComponent, PointFeatureSummaryComponent,
  PovertyBreakdownSummaryComponent, 
  CrimeBreakdownSummaryComponent, SchoolFeatureSummaryComponent,
  PovertyChartComponent,
  LeadBreakdownSummaryComponent
} from "./components";
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: 'about', component: AboutPageComponent},
  { path: 'lead', component: LeadGraphsComponent},
  { path: 'covid', component: CovidGraphsComponent},
  { path: 'mapresources', component: MapResourceGraphsComponent},
  { path: 'mapfeatures', component: MapFeaturesGraphsComponent},
  { path: 'graphs', component: GraphsPageComponent},




];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapComponent,
    MapBoxComponent,
    MapSidebarComponent,
    BreakdownChartComponent,
    PointFeatureSummaryComponent,
    BreakdownSummaryComponent,
    LeadBreakdownSummaryComponent,
    PovertyBreakdownSummaryComponent,
    CrimeBreakdownSummaryComponent,
    SchoolFeatureSummaryComponent,
    FetchErrorComponent,
    WorksCitedComponent,
    PovertyLevelComponent,
    PovertyChartComponent,
    NavigationBarComponent,
    CovidBreakdownSummaryComponent,
    AboutPageComponent,
    LeadGraphsComponent,
    SideBarComponent,
    CovidGraphsComponent,
    MapFeaturesGraphsComponent,
    MapResourceGraphsComponent,
    GraphsPageComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatDividerModule,
    NgChartsModule,
    MatTabsModule,
    MatSlideToggleModule,
    FormsModule,
    MatButtonToggleModule,
    MatGridListModule,
    MatTableModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
