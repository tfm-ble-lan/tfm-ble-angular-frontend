import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Map, Marker, Popup } from 'maplibre-gl';
import { MapDrawerService } from 'src/app/services/map-drawer/map-drawer.service';
import { Subscription } from 'rxjs';
import { BleDevice } from 'src/app/services/ble-devices/ble-devices';



interface AgentSelection {
  agentName: string;
  bleDevices: BleDevice[];
}

@Component({
  selector: 'app-my-map',
  templateUrl: './my-map.component.html',
  styleUrls: ['./my-map.component.scss']
})
export class MyMapComponent implements OnInit, AfterViewInit {
  
  subscription: Subscription;
  selectedAgent: string;
  selectedBleDevices: {[key: string]: BleDevice[]} = {};
  
  @ViewChild('map')
  private mapContainer: ElementRef<HTMLElement>;
  
  private map: Map;
  
  private initialState = {
    lng: -3.600833,
    lat: 37.178055,
    zoom: 21
  };
  
  private max_distancia_ble = 30;
  private max_value_rssi = 1;

  constructor( private mapService: MapDrawerService) { 
    this.subscription = this.mapService.agentSelected$.subscribe(
      (selection: AgentSelection) => {
        this.selectedAgent = selection.agentName;
        this.selectedBleDevices[this.selectedAgent] = selection.bleDevices;
    
        
        //Pintar Agente
        const selectedBleDevices = this.selectedBleDevices[this.selectedAgent];
        let longitude: number;
        let latitude: number;
        // Iterar sobre cada objeto BleDevice y obtener la longitud de su agente_localization
        selectedBleDevices.forEach(device => {
          // Obtener el primer objeto Detection del arreglo detections
          const firstDetection = device.detections[0];
          // Obtener la longitud del objeto agent_localization
          longitude = firstDetection.agent_localization.longitude;
          latitude = firstDetection.agent_localization.latitude;
          console.log(`El agente ${this.selectedAgent} esta en ${longitude} ${latitude}`);
        });


        //Pintar circunferencias
        selectedBleDevices.forEach(device => {
          // Obtener el primer objeto Detection del arreglo detections
          device.detections.forEach(detection => {
            this.addAgent(longitude,latitude,detection.rssi, device.mac)
            console.log(`El BleDevice ${device.mac} esta a ${detection.rssi}`);  
          });
          // Obtener la longitud del objeto agent_localization
          
          
          
        });
        

        
        // ...lógica de actualización del mapa...
      }
    );
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const myAPIKey = 'e28d410f0e59477eb94a5522b7165150'; 
    const mapStyle = 'https://maps.geoapify.com/v1/styles/osm-liberty/style.json';

  
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `${mapStyle}?apiKey=${myAPIKey}`,
      center: [this.initialState.lng, this.initialState.lat],
      zoom: this.initialState.zoom
    });

    
  }

  private rssiToMetersBasica(rssi: number): number{

    return (rssi*this.max_distancia_ble)/this.max_value_rssi

  }

  /*
  La conversión de RSSI (Received Signal Strength Indicator) a distancia en 
  metros es compleja y depende de muchos factores, como la potencia de transmisión 
  del dispositivo BLE, la sensibilidad de recepción del receptor, el entorno de la señal 
  y las obstrucciones, entre otros.

  Sin embargo, hay algunas aproximaciones que se pueden utilizar para obtener una idea 
  aproximada de la distancia en metros. Una de las fórmulas más comunes se conoce como la 
  fórmula de Friis, que establece una relación entre la potencia de la señal recibida (RSSI), 
  la distancia y otras variables. La fórmula de Friis es la siguiente:

  PR = PT + Gt + Gr - 32.45 - 20*log10(d)
  */ 
  private formulaFriis(rssi: number): number{
    // Parámetros de la fórmula
    const frequency = 2400; // Frecuencia en MHz
    const txPower = -20; // Potencia de transmisión en dBm
    const rxSensitivity = -90; // Sensibilidad del receptor en dBm

    // Constantes
    const c = 299792458; // Velocidad de la luz en m/s
    const lambda = c / (frequency * 1e6); // Longitud de onda en metros

    // Cálculo de la distancia en metros
    const distance = Math.pow(10, ((txPower - rssi - rxSensitivity) / (10 * 2))) * lambda / 4 / Math.PI;

    return distance
  }

  private alernativaformulaFriis(rssi: number, txPower: number): number{
    // Se define la constante TX_POWER que representa la potencia de transmisión del dispositivo BLE
    // Esta constante se expresa en dBm y puede variar según el dispositivo
    const TX_POWER = -59;

    // Función que convierte la señal RSSI a distancia en metros
    // Recibe como parámetro la señal RSSI en dBm
    // Retorna la distancia en metros
    
    // Se calcula la diferencia entre la potencia de transmisión y la señal RSSI recibida
    const difference = TX_POWER - rssi;
    
    // Se calcula la relación entre la diferencia de potencia y la atenuación de la señal
    // Se puede estimar que la atenuación es de 2.0 en entornos libres de obstáculos y de 3.0 en entornos urbanos o con obstáculos
    const ratio = difference / 6.0;
    
    // Se calcula la distancia en metros a partir de la relación obtenida
    // Se utiliza la fórmula: d = 10 ^ ratio
    const distance = Math.pow(10, ratio);
    
    return distance;
    
  }

  public addAgent(longitude: number, latitude: number, radiusRssi: number, popupText: string) {
    
    const radius = radiusRssi; // Radio en metros
    const center = [longitude, latitude]; // Centro del mapa
  
    
    // Crear los datos de origen del círculo

    let sphereData = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: center
      },
      properties: {
        radius: radius
      }
    };
    
    this.map.addSource("sphere", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [sphereData]
      }
    });

    // Agregar la capa de círculo para dibujar la esfera
    this.map.addLayer({
      id: "sphere-layer",
      type: "circle",
      source: "sphere",
      paint: {
        "circle-color": "transparent", // Color de la esfera
        "circle-opacity": 0.5, // Opacidad de la esfera
        "circle-stroke-color": "#ff0000", // Color del borde rojo
        "circle-stroke-width": 2, // Ancho del borde
        "circle-radius": {
          property: "radius",
          type: "exponential",
          stops: [
            [0, 0],
            [20, radius * 2] // Escala de radio en función del zoom
          ]
        }
      }
    });
  }
  
  public addDevice(longitude: number, latitude: number, popupText: string) {
    const marker = new Marker({color: 'red'})
      .setLngLat([longitude, latitude])
      .setPopup(new Popup().setHTML(popupText))
      .addTo(this.map);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

