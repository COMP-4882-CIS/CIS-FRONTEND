import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {RepEmailFormComponent} from './components/rep-email-form/rep-email-form.component';
import {HomeComponent, ZipcodeComponent} from "./pages";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MapComponent } from './map/map.component';
import { MarkerService } from './marker.service';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ZipcodeComponent,
    RepEmailFormComponent,
    MapComponent,
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

    ],
  providers: [
    MarkerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
