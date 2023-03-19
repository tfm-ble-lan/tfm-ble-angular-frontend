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
    zoom: 18
  };
  

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

