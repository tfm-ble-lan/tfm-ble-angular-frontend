import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { Map, Marker, LngLat, Popup } from 'maplibre-gl';
import { MapDrawerService } from 'src/app/services/map-drawer/map-drawer.service';
import { Subscription } from 'rxjs';
import { BleDevice, Detection, Localization } from 'src/app/services/ble-devices/ble-devices';
import { BleDevicesService } from 'src/app/services/ble-devices/ble-devices.service';


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
  subscription2: Subscription;
  selectedAgent: string;
  selectedBleDevices: {[key: string]: BleDevice[]} = {};
  agentMarker: {[key: string]: Marker} = {};
  private lastAgentLocations: {[key: string]: {longitude: number, latitude: number}} = {};
  private lastAgentBLEMACs: {[key: string]: string[]} = {};

  @Output() bleDetected = new EventEmitter<{ device:BleDevice, detection:Detection }>();
  
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

  constructor( private mapService: MapDrawerService, private bleDeviceService: BleDevicesService) {}

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

    

    this.subscription = this.mapService.agentSelected$.subscribe(
      (selection: AgentSelection) => {
        this.selectedAgent = selection.agentName;
        this.selectedBleDevices[this.selectedAgent] = selection.bleDevices;
  
        //Primero pinto el Agente
        this.handleAgentSelection(selection); // llama al nuevo método
        
      }
    );


    this.subscription = this.mapService.agentUnselected$.subscribe(
      (unselection: AgentSelection) => {
        this.selectedAgent = unselection.agentName;
        this.selectedBleDevices[this.selectedAgent] = unselection.bleDevices;
  
        this.handleAgentUnselection(unselection); // llama al nuevo método
      }
    );

    // Centrar las coordenadas
    this.subscription2 = this.mapService.centerMap$.subscribe(
      (selection: Localization) => {
        this.updateMapCenter(selection.longitude, selection.latitude)
      }
    );
   
    this.map.on('load', () => {
      console.log("map loaded");
      // Suscribirse a eventos después de que el mapa se haya cargado
      this.map.on('zoomend', () => {
        console.log("zoom")
        this.updateCircles();
      });
    });
     
  }

  updateCircles() {

    Object.keys(this.agentMarker).forEach(key => {
      const agent: AgentSelection = { agentName: key, bleDevices: this.selectedBleDevices[key]}
      this.handleAgentUnselection(agent);
      this.handleAgentSelection(agent);
      console.log(key);
    });
    // Código para actualizar los círculos en el mapa
  }

  handleAgentUnselection(selection: AgentSelection) {
    if ( this.agentMarker[selection.agentName]){
      this.agentMarker[selection.agentName].setPopup(null);
      this.agentMarker[selection.agentName].remove();

      this.lastAgentBLEMACs[selection.agentName].forEach((mac) => {
        this.map.removeLayer(`${mac}-label-layer`);
        this.map.removeLayer(`${mac}-sphere-layer`);
        this.map.removeSource(mac);
      });
      this.lastAgentBLEMACs[selection.agentName] = [];
    }
    //ToDo: Quitar los sources mac y las layers mac-sphere-layer

  }

  handleAgentSelection(selection: AgentSelection) {
    const selectedBleDevices = selection.bleDevices;
    let longitude: number;
    let latitude: number;
    // Iterar sobre cada objeto BleDevice y obtener la longitud de su agente_localization
    selectedBleDevices.forEach(device => {
      // Obtener el primer objeto Detection del arreglo detections
      const firstDetection = device.detections[0];
      // Obtener la longitud del objeto agent_localization
      longitude = firstDetection.agent_localization.longitude;
      latitude = firstDetection.agent_localization.latitude;
      
      console.log(`El agente ${selection.agentName} esta en ${longitude} ${latitude}`);
    });
    //Pinto el Agente
    this.agentMarker[selection.agentName] =  new Marker().setLngLat([longitude, latitude]);
    this.agentMarker[selection.agentName].addTo(this.map);

    const popup = new Popup({ 
      closeOnClick: false 
    }).setLngLat(
      [longitude, latitude]
      ).setHTML(`<p> ${selection.agentName} </p>`)
    
    // Asociar el Popup al Marker
    this.agentMarker[selection.agentName].setPopup(popup);

    // Mostrar el Popup
    popup.addTo(this.map);

    //Dibujo los devices asociados al Agente
    this.handleBleDevices(longitude, latitude);
  }
 
  handleBleDevices(longitude: number, latitude: number){
    //Despues pinto los BLEDevices
    this.selectedBleDevices[this.selectedAgent].forEach(device => {
      device.detections.forEach(detection => {
        this.drawBleDevice(device.address, this.selectedAgent, longitude, latitude, 
          this.simplificacionFormulaFris(detection.rssi, detection.tx_power), device.certified)
        
        //Imprimo en el historico
        this.bleDeviceService.bleDeviceSelected(device, detection);
        console.log(`El BleDevice ${device.address} esta a ${detection.rssi}`);  
      });
      // Obtener la longitud del objeto agent_localization
    });
  }

  // Calcula el radio en metros a partir del área en metros cuadrados
  calculateRadius(radiusInPixels:number):number {
    return radiusInPixels * Math.pow(2, 21 - 10);
  }

  metersToPixels(meters: number, zoom: number): number {
    const earthCircumference = 40075017;
    const metersPerPixel = earthCircumference * Math.cos(this.map.getCenter().lat * Math.PI / 180) / Math.pow(2, zoom + 8);
    return meters / metersPerPixel;
  }
  // Método para dibujar un círculo en el mapa
  drawBleDevice(address:string, agentName: string, longitude: number, 
    latitude: number, radius: number, certified: boolean) {
    const center = [longitude, latitude]; // Centro del mapa
    // Crear los datos de origen del círculo
    let border_color_green = '#006B3C';
    let border_color = "#ff0000"
    if (certified) {
      border_color = border_color_green;
    }

    let sphereData = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: center
      },
      properties: {
        radius: Math.abs(radius / (156543.03392 * Math.cos(this.map.getCenter().lat) / (2**this.map.getZoom()))),
        text: address
      }
    };
    
    this.map.addSource(address, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [sphereData]
      }
    });

    // Agregar la capa de círculo para dibujar la esfera
    this.map.addLayer({
      id: `${address}-sphere-layer`,
      type: "circle",
      source: address,
      paint: {
        "circle-color": "transparent", // Color de la esfera
        "circle-opacity": 0.5, // Opacidad de la esfera
        "circle-stroke-color": border_color, // Color del borde rojo
        "circle-stroke-width": 2, // Ancho del borde
        "circle-radius":  Math.abs(radius / (156543.03392 * Math.cos(this.map.getCenter().lat) / (2**this.map.getZoom())))
        
         // Escala de radio en función del zoom
      }
    });
    
    console.log(radius);
    // Agregar la capa de texto para mostrar la etiqueta
    this.map.addLayer({
      id: `${address}-label-layer`,
      type: "symbol",
      source: address,
      layout: {
        "text-field": address, // Obtener el texto a mostrar de la propiedad "label"
        "text-size": 12,
        "text-offset": [
          Math.abs(Math.abs(radius / (156543.03392 * Math.cos(this.map.getCenter().lat) / (2**this.map.getZoom()))))/12, 
          Math.abs(Math.abs(radius / (156543.03392 * Math.cos(this.map.getCenter().lat) / (2**this.map.getZoom()))))/12
        ], // Ajustar la posición del texto con respecto al círculo
        "text-anchor": "top"
      },
      paint: {
        "text-color": "#000000" // Color del texto
      }
    });

    // Guarda la referencia al círculo en la variable circle
    //this.lastAgentBLECircles[agentName].push(circle);
    if (this.lastAgentBLEMACs[agentName]){
      this.lastAgentBLEMACs[agentName].push(address);

    }
    else{
      this.lastAgentBLEMACs[agentName] = [];
      this.lastAgentBLEMACs[agentName].push(address);
    }
  }

  addHistoricalBleDevice(device: BleDevice, detection: Detection) {
    // Lógica para detectar BLE y obtener sus parámetros
    
    this.bleDetected.emit({device, detection}); // Emitir el evento con los parámetros del BLE detectado
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
  private formulaFriis(rssi: number, txPOWER?: number): number{
    // Parámetros de la fórmula
    const frequency = 2400; // Frecuencia en MHz
    const txPower = txPOWER ? txPOWER : 9; // Potencia de transmisión en dBm
    const rxSensitivity = -90; // Sensibilidad del receptor en dBm

    // Constantes
    const c = 299792458; // Velocidad de la luz en m/s
    const lambda = c / (frequency * 1e6); // Longitud de onda en metros

    // Cálculo de la distancia en metros
    const distance = Math.pow(10, ((txPower - rssi - rxSensitivity) / (10 * 2))) * lambda / 4 / Math.PI;

    return distance
  }

  private simplificacionFormulaFris(rssi: number, txPower?: number): number {
    //Por defecto 7
    const txPow = txPower ? txPower : 7;
    const atenuacion = 10; //
    const ratio = (txPow - rssi) / (10.0*atenuacion); // Ratio de señal a ruido (SNR)
    const distance = Math.pow(10, ratio); // Distancia en metros
    console.log("Simplificacion friss: "+distance)
    return distance;
  }

  

  public updateMapCenter(lng: number, lat: number): void {
    this.map.setCenter([lng, lat]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

function getEarthCircumference() {
  return 40075017;
}