import { Component, OnInit,  ViewChild, ElementRef } from '@angular/core';
import { BleDevice, Detection, Manufacturer } from 'src/app/services/ble-devices/ble-devices';
import { BleDevicesService } from 'src/app/services/ble-devices/ble-devices.service';

@Component({
  selector: 'app-localizador',
  templateUrl: './localizador.component.html',
  styleUrls: ['./localizador.component.scss']
})
export class LocalizadorComponent implements OnInit {

  bleDevices: BleDevice[];
  bleDevicesByAgent: {[key: string]: BleDevice[]} = {};
  devices: BleDevice[];
  detectors: string[];
  detectionSectionCollapsed: { [key: string]: boolean } = {};
  activeInfo = '';
  bleToLocate: BleDevice;
  running: boolean = false;

  @ViewChild('canvasElem', { read: ElementRef }) canvasRefs: ElementRef;
  
  constructor(private bleDevicesService: BleDevicesService) { }

  ngOnInit(): void {
    this.bleDevicesService.getAllBLEs().subscribe(
      bles => {
        this.bleDevices = bles;
        this.detectors = this.getDetectors();

        this.detectors.forEach(detector => {
          this.bleDevicesService.getLastDetectionByAgent(detector).subscribe(
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

  toggleDetectionSection(detector: string) {
    this.detectionSectionCollapsed[detector] = !this.detectionSectionCollapsed[detector];
  }

  async showCanvas(address:string, agent: string ) {
    this.activeInfo = address;
    
    this.running = false;
    await new Promise(resolve => setTimeout(resolve, 5000));

    this.localizarDispositivo(agent, address);
  
    let intervalId = setInterval(() => {
      if (this.running) {
        this.localizarDispositivo(agent, address);
      }
      else{
        clearInterval(intervalId);
      }
    }, 5000);
  }
  
  getCircleColor(radius: number): string {
    const hue = Math.max(0, Math.min(240, ((radius / 100) * 240))); // Limita el valor de hue entre 0 y 240
    return `hsl(${hue}, 100%, 50%)`; // Devuelve el color en formato hsl
  }
  

  pintarCirculoCanvas(radius: number): void{
    let canvas: HTMLCanvasElement;
    const interval = setInterval(() => {
      // Verificar si el canvas ya ha sido cargado
      if (this.canvasRefs) {
        canvas = this.canvasRefs.nativeElement;
  
        // Obtener el contexto del canvas y dibujar el círculo
        const ctx = canvas.getContext('2d');
        //Borro todo
        ctx.clearRect(0, 0, canvas.width, canvas.height);
       
        //Pinto la XXXX
        


        //Pinto el circulo
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
       
        //Pinto la X 
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(centerX - 25, centerY - 25);
        ctx.lineTo(centerX + 25, centerY + 25);
        ctx.moveTo(centerX - 25, centerY + 25);
        ctx.lineTo(centerX + 25, centerY - 25);
        ctx.stroke();

        console.log(centerX)
        console.log(centerY)

        // Dibujar el círculo centrado en el canvas
        const circleColor = this.getCircleColor(radius);
        ctx.strokeStyle = circleColor;
        ctx.lineWidth = 10;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
  
        clearInterval(interval); // Detener el intervalo
      }
    }, 100); // Verificar cada 100ms si el canvas ha sido cargado

  }

  localizarDispositivo(agent: string, address:string ):void {
   
    this.bleDevicesService.getLastDetectionByAgent(agent).subscribe(
      bles => {
        bles.forEach( 
          ble => {
            if (ble.address == address){
              this.bleToLocate = ble;
              console.log(ble.detections[0].rssi)
              this.pintarCirculoCanvas(Math.abs(ble.detections[0].rssi)*2.5);
              this.running = true;
              return 0;
            }
          }
        );
      }
    );
  }

  

}
