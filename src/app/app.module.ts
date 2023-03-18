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

@NgModule({
  declarations: [
    AppComponent,
    MyMapComponent,
    MenuComponent,
    FormularioComponent,
    AgentsComponent
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
