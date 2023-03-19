import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BleDevice } from '../ble-devices/ble-devices';


interface AgentSelection {
  agentName: string;
  bleDevices: BleDevice[];
}

@Injectable({
  providedIn: 'root'
})
export class MapDrawerService {

  private agentSelectedSource = new Subject<AgentSelection>();

  agentSelected$ = this.agentSelectedSource.asObservable();

  agentSelected(agentName: string, bleDevices: BleDevice[]) {
    const selection: AgentSelection = { agentName, bleDevices };
    this.agentSelectedSource.next(selection);
  }
}
