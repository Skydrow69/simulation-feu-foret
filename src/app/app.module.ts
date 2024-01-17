import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { CellComponent } from './cell/cell.component';
import { SimulationComponent } from './simulation/simulation.component';
import { HttpClientModule } from '@angular/common/http'; // Importez le module HttpClientModule
import { SimulationService } from './services/simulation.service';
import { ConfigService } from './services/config.service';



@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    CellComponent,
    SimulationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [SimulationService, ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
