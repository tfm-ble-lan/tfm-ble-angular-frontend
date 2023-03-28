import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BleDevice } from '../ble-devices/ble-devices';
import { Localization } from '../ble-devices/ble-devices';

interface AgentSelection {
  agentName: string;
  bleDevices: BleDevice[];
}



@Injectable({
  providedIn: 'root'
})
export class MapDrawerService {

  private agentSelectedSource = new Subject<AgentSelection>();
  private agentUnselectedSource = new Subject<AgentSelection>();
  private agentRefreshSource = new Subject<AgentSelection>();
  private centerMapSource = new Subject<Localization>();

  agentSelected$ = this.agentSelectedSource.asObservable();
  agentUnselected$ = this.agentUnselectedSource.asObservable();
  agentRefresh$ = this.agentRefreshSource.asObservable();
  centerMap$ = this.centerMapSource.asObservable();

  agentSelected(agentName: string, bleDevices: BleDevice[]) {
    const selection: AgentSelection = { agentName, bleDevices };
    this.agentSelectedSource.next(selection);
  }


  agentUnselected(agentName: string, bleDevices: BleDevice[]) {
    const selection: AgentSelection = { agentName, bleDevices };
    this.agentUnselectedSource.next(selection);
  }

  agentRefresh(agentName: string, bleDevices: BleDevice[]) {
    const selection: AgentSelection = { agentName, bleDevices };
    //this.agentUnselectedSource.next(selection);
  }

  centerMap(longitude: number, latitude: number) {
    const selection: Localization = { longitude, latitude };
    this.centerMapSource.next(selection);
  }

}
