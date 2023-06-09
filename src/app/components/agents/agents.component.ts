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
  autoRefresh: boolean = false;
  intervalId: any;

  constructor(
    private agentsService: AgentsService, 
    private bleDevicesService: BleDevicesService, 
    private mapService: MapDrawerService
    ) {
      //this.selectedItems = Array(this.agents.length).fill(false);
    }

  ngOnInit(): void {
  
    this.refreshAgents();

  }
  
  onCheckboxChange(agentName: string, index: number): void {
    if (this.selectedItems[index]) {
      console.log('Item selecccionado')
      this.agentBleDevices[agentName] = [];
      this.bleDevicesService.getLastDetectionByAgent(agentName).subscribe( 
        (ble_devices) => {
          this.mapService.agentUnselected(agentName, this.agentBleDevices[agentName]);
          this.agentBleDevices[agentName] = ble_devices
          this.mapService.agentSelected(agentName, this.agentBleDevices[agentName]);
          console.log(this.agentBleDevices[agentName])
        },
        (error) => {
          console.error(error);
        }
      );
    }else{
      console.log('Item deselecccionado')
      this.mapService.agentUnselected(agentName, this.agentBleDevices[agentName]);

    }
  
  }

  refreshAgents(): void {
    this.agentsService.getAgents().subscribe(
      agents => {
        this.agents = agents;
        console.log('Agents:', agents);
        //Inicilizo los checkbox a falso
        if(!this.selectedItems){
          this.selectedItems = Array(this.agents.length).fill(false);
        }
       },
      error => console.log(error)
        // Manejar el error aquí
    
    );
    if (this.agents) {
      let index = -1;
      this.agents.forEach( (agent) => {
        index++;
        this.onCheckboxChange(agent.name, index)
      });
    }
  }

  centrarMapa(agentName):void{
    
    let longitude:number;
    let latitude: number;

    this.bleDevicesService.getLastDetectionByAgent(agentName).subscribe( 
      (ble_devices) => {
        longitude = ble_devices[0].detections[0].agent_localization.longitude;
        latitude = ble_devices[0].detections[0].agent_localization.latitude;
        console.log(longitude+" Lon "+latitude+ "Lan")
        this.mapService.centerMap(longitude, latitude);
      },
      (error) => {
        console.error(error);
      }
    );
  }
 
  
  toggleAutoRefresh() {
    if (this.autoRefresh) {
      this.intervalId = setInterval(() => {
        this.refreshAgents();
      }, 10000);
    } else {
      clearInterval(this.intervalId);
    }
  }

}
