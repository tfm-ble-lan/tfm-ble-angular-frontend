import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BleDevice, Detection } from 'src/app/services/ble-devices/ble-devices';
import { BleDevicesService } from 'src/app/services/ble-devices/ble-devices.service';
import { Subscription } from 'rxjs';

interface BLEDeviceSelection {
  device: BleDevice;
  detection: Detection;
}

@Component({
  selector: 'app-historico-bles',
  templateUrl: './historico-bles.component.html',
  styleUrls: ['./historico-bles.component.scss']
})
export class HistoricoBlesComponent implements OnInit{
  subscription: Subscription;  
  bleDetectados: { device: BleDevice, detection: Detection }[] = []; 

  constructor(private bleDeviceService: BleDevicesService) { }

  ngOnInit(): void {

    this.subscription = this.bleDeviceService.bleDeviceSelected$.subscribe(
      (selection: BLEDeviceSelection) => {
        
        const existe = this.bleDetectados.some((elem) => {
          return elem.detection.timestamp === selection.detection.timestamp && elem.device.address === selection.device.address;
        });
        
        // Si no existe, insertar el nuevo objeto en el array
        if (!existe) {
          this.bleDetectados.unshift(selection);
        }
        
        //Primero pinto el Agente
      }
    );
  }

  public formatTimestampDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  public formatTimestampTime(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${hours}:${minutes}:${seconds}`;
  }

}
