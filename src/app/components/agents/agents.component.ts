import { Component, OnInit } from '@angular/core';
import { AgentsService } from 'src/app/services/agents/agents.service';
import { Agent } from 'src/app/services/agents/agent';
import { BleDevice } from 'src/app/services/ble-devices/ble-devices';
import { BleDevicesService } from 'src/app/services/ble-devices/ble-devices.service';
import { MapDrawerService } from 'src/app/services/map-drawer/map-drawer.service';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {
  agents: Agent[];
  ble_devices: BleDevice[] = [];
  selectedItems: boolean[];
  agentBleDevices: {[key: string]: BleDevice[]} = {};

  constructor(
    private agentsService: AgentsService, 
    private bleDevicesService: BleDevicesService, 
    private mapService: MapDrawerService
    ) { }

  ngOnInit(): void {
  
    this.agentsService.getAgents().subscribe(
      agents => {
        this.agents = agents;
        console.log('Agents:', agents);
        //Inicilizo los checkbox a falso
        this.selectedItems = Array(this.agents.length).fill(false);
       },
      error => console.log(error)
        // Manejar el error aquí
      
    );

  }
  
  onCheckboxChange(agentName: string, index: number): void {
    this.selectedItems[index] = !this.selectedItems[index];
    if (!this.selectedItems[index]) {
      console.log('Item selecccionado')
      this.agentBleDevices[agentName] = [];
      this.bleDevicesService.getLastDetectionByAgent(agentName).subscribe( 
        (ble_devices) => {
          this.agentBleDevices[agentName] = ble_devices
          this.mapService.agentSelected(agentName, this.agentBleDevices[agentName]);
          console.log(this.agentBleDevices[agentName])
        },
        (error) => {
          console.error(error);
        }
      );
    }
    
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
