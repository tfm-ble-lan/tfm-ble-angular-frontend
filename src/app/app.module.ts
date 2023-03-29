import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// Importación para hacer peticiones REST
import { HttpClientModule } from "@angular/common/http";

// para coger datos de formularios
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyMapComponent } from './components/my-map/my-map.component';
import { MenuComponent } from './components/menu/menu.component';
import { FormularioComponent } from './components/formulario/formulario.component';
import { AgentsComponent } from './components/agents/agents.component';
import { BleDevicesComponent } from './components/ble-devices/ble-devices/ble-devices.component';
import { HistoricoBlesComponent } from './components/historico-bles/historico-bles/historico-bles.component';
import { LoginComponent } from './components/login/login/login.component';
import { AyudaComponent } from './components/ayuda/ayuda/ayuda.component';
import { AdministracionAgentesComponent } from './components/administracion-agentes/administracion-agentes/administracion-agentes.component';
import { AdministracionBlesComponent } from './components/administracion-bles/administracion-bles/administracion-bles.component';
import { LocalizadorComponent } from './components/localizador/localizador/localizador.component';


@NgModule({
  declarations: [
    AppComponent,
    MyMapComponent,
    MenuComponent,
    FormularioComponent,
    AgentsComponent,
    BleDevicesComponent,
    HistoricoBlesComponent,
    LoginComponent,
    AyudaComponent,
    AdministracionAgentesComponent,
    AdministracionBlesComponent,
    LocalizadorComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,    
    AppRoutingModule,
    FormsModule
  ],  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
