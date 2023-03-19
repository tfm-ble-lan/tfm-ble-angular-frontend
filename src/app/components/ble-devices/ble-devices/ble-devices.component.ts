import { Component, OnInit } from '@angular/core';
import { Agent } from 'src/app/services/agents/agent';

@Component({
  selector: 'app-ble-devices',
  templateUrl: './ble-devices.component.html',
  styleUrls: ['./ble-devices.component.scss']
})
export class BleDevicesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  public searchLastBLEDevicesFoundByAgent(agent_name: string) {

  }


}
