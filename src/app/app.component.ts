import { Component } from '@angular/core';
import { AgentsService } from './services/agents/agents.service';
import { Agent } from './services/agents/agent';
import { MapDrawerService } from './services/map-drawer/map-drawer.service';
import { MyMapComponent } from './components/my-map/my-map.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'angular-project';
  agents: Agent[];


  // Inyectar servicio en constructor
  constructor(private agentsService: AgentsService) {
    //this.probarGet();
    
  }
  

  onCheckboxChange() {
    //Este evento salta cuando se pulsa un checkbox, deberia de 
    // hacer uso de un servicio BLE-Devices que recogiera todos los objetos detectados
    // la ultima vez, 


    //this.mapService.getPuntos(this.selectedItems).subscribe(puntos => {
      // Actualizar los puntos a mostrar en el mapa
    //});

    //luego, una vez recogidos los valores de los puntos deberia pintarlos
    
    //this.mapComponent.addSphere()
  }

  
 

}
