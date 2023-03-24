import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyMapComponent } from './components/my-map/my-map.component';
import { FormularioComponent } from './components/formulario/formulario.component';

const routes: Routes = [
  { path: '**', component: FormularioComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
