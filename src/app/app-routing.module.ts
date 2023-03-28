import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyMapComponent } from './components/my-map/my-map.component';
import { FormularioComponent } from './components/formulario/formulario.component';
import { LoginComponent } from './components/login/login/login.component';
import { AyudaComponent } from './components/ayuda/ayuda/ayuda.component';
import { AdministracionAgentesComponent } from './components/administracion-agentes/administracion-agentes/administracion-agentes.component';
import { AdministracionBlesComponent } from './components/administracion-bles/administracion-bles/administracion-bles.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, 
  { path: 'login', component: LoginComponent },
  { path: 'formularios', component: FormularioComponent },
  { path: 'ayuda', component: AyudaComponent },
  { path: 'administracion/agentes', component: AdministracionAgentesComponent },
  { path: 'administracion/bles', component: AdministracionBlesComponent },
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
