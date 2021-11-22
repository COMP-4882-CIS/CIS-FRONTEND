import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {HomeComponent} from "./pages";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatIconModule} from "@angular/material/icon";
import {MapComponent} from './components/map/map.component';
import {MapBoxComponent} from './components/map-box/map-box.component';
import {MapSidebarComponent} from './components/map-sidebar/map-sidebar.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatDividerModule} from "@angular/material/divider";
import {NgChartsModule} from 'ng2-charts';
import {BreakdownChartComponent} from './components/breakdown-chart/breakdown-chart.component';
import {MatTabsModule} from "@angular/material/tabs";
import { PointFeatureSummaryComponent } from './components/point-feature-summary/point-feature-summary.component';
import { BreakdownSummaryComponent } from './components/breakdown-summary/breakdown-summary.component';
import { PovertyBreakdownSummaryComponent } from './components/poverty-breakdown-summary/poverty-breakdown-summary.component';
import { SchoolFeatureSummaryComponent } from './components/school-feature-summary/school-feature-summary.component';
import { FetchErrorComponent } from './components/fetch-error/fetch-error.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {MatButtonToggleModule} from "@angular/material/button-toggle";

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
    PovertyBreakdownSummaryComponent,
    SchoolFeatureSummaryComponent,
    FetchErrorComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
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
        MatButtonToggleModule
    ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
