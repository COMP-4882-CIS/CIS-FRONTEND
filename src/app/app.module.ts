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
import {HomeComponent, PovertyLevelComponent, WorksCitedComponent} from "./pages";
import {
  BreakdownChartComponent,
  BreakdownSummaryComponent, FetchErrorComponent,
  MapBoxComponent,
  MapComponent, MapSidebarComponent, PointFeatureSummaryComponent,
  PovertyBreakdownSummaryComponent, SchoolFeatureSummaryComponent,
  PovertyChartComponent
} from "./components";

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
    WorksCitedComponent,
    PovertyLevelComponent,
    PovertyChartComponent,
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
