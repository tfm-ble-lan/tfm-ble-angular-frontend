import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Map, Marker, Popup } from 'maplibre-gl';
import { FormularioComponent } from '../formulario/formulario.component';
import { MapDrawerService } from 'src/app/services/map-drawer/map-drawer.service';

@Component({
  selector: 'app-my-map',
  templateUrl: './my-map.component.html',
  styleUrls: ['./my-map.component.scss']
})
export class MyMapComponent implements OnInit, AfterViewInit {

  @ViewChild('map')
  private mapContainer: ElementRef<HTMLElement>;
  
  private map: Map;
  
  private initialState = {
    lng: -3.600833,
    lat: 37.178055,
    zoom: 18
  };
  

  constructor( private mapService: MapDrawerService) { }

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

  public addAgent(longitude: number, latitude: number, popupText: string) {
    
    const radius = 100; // Radio en metros
    const center = [longitude, latitude]; // Centro del mapa
  
    // Crear los datos de origen del círculo

    const sphereData = {
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
        "circle-color": "#ff0000", // Color de la esfera
        "circle-opacity": 0.5, // Opacidad de la esfera
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


}

