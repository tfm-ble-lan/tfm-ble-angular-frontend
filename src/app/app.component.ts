import { Component } from '@angular/core';
import { AgentsService } from './services/agents/agents.service';
import { Agent } from './services/agents/agent';
import { BleDevicesService } from './services/ble-devices/ble-devices.service';
import { BleDevice } from './services/ble-devices/ble-devices';
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
  devices: BleDevice[] = [];

  // Inyectar servicio en constructor
  constructor(private agentsService: AgentsService, private bleDeviceService: BleDevicesService ) {
    //this.probarGet();
    
  }
  
  /*
  onCheckboxChange(agentName: string): void {
    //Este evento salta cuando se pulsa un checkbox, deberia de 
    // hacer uso de un servicio BLE-Devices que recogiera todos los objetos detectados
    // la ultima vez, 
    
    this.bleDeviceService.getLastDetectionByAgent(agentName).subscribe( ble_devices => {
      this.devices = ble_devices
    });

    console.log('Ojete')

    //this.mapService.getPuntos(this.selectedItems).subscribe(puntos => {
      // Actualizar los puntos a mostrar en el mapa
    //});

    //luego, una vez recogidos los valores de los puntos deberia pintarlos
    
    //this.mapComponent.addSphere()
  }*/

  
 

}
