import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PdfViewerModule } from 'ng2-pdf-viewer'; // Import PdfViewerModule
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent // Declare HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PdfViewerModule, // Add PdfViewerModule to imports
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
