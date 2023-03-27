import { Component, OnInit } from '@angular/core';
import { BleDevice, Detection, Manufacturer } from 'src/app/services/ble-devices/ble-devices';
import { BleDevicesService } from 'src/app/services/ble-devices/ble-devices.service';
@Component({
  selector: 'app-administracion-bles',
  templateUrl: './administracion-bles.component.html',
  styleUrls: ['./administracion-bles.component.scss']
})
export class AdministracionBlesComponent implements OnInit {
  bleDevices: BleDevice[];
  bleDevicesByAgent: {[key: string]: BleDevice[]} = {};
  devices: BleDevice[];
  detectors: string[];
  detectionSectionCollapsed: { [key: string]: boolean } = {};
  
  constructor(private bleDevicesService: BleDevicesService) { }

  ngOnInit(): void {
    this.bleDevicesService.getAllBLEs().subscribe(
      bles => {
        this.bleDevices = bles;
        this.detectors = this.getDetectors();

        this.detectors.forEach(detector => {
          this.bleDevicesService.getAllBLesDetectedByAgent(detector).subscribe(
            blesByAgent => {
              this.bleDevicesByAgent[detector] = blesByAgent
            }

          )
        });
       },
      error => console.log(error)
        // Manejar el error aquí
    
    );
    
  }

  getDetectors(): string[] {
    // Crear lista de detectores a partir de los datos obtenidos de la base de datos
    const detectors: string[] = [];
    this.bleDevices.forEach(device => {
      device.detections.forEach(detection => {
        if (!detectors.includes(detection.detected_by_agent)) {
          detectors.push(detection.detected_by_agent);
        }
      });
    });
    return detectors;
  }

  getBleDevicesByAgent(detector: string ): BleDevice[] {
    return this.bleDevicesByAgent[detector]
  }


  getBleDevicesDetectionsByAgent(detector: string, device: BleDevice ): Detection[] {
    return device.detections
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

  certificarDispositivo(device: BleDevice){
    this.bleDevicesService.certificarBleDevice(device).subscribe(
      (response) => {
        console.log('Todo bien')
      },
      (error) => {
        // Aquí puedes manejar el error de la petición `PUT`.
      }
    );
  }

  toggleDetectionSection(detector: string) {
    this.detectionSectionCollapsed[detector] = !this.detectionSectionCollapsed[detector];
  }


}
