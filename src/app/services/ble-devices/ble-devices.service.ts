import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { BleDevice,Detection,Localization,BleDevicesResponse } from './ble-devices';

@Injectable({
  providedIn: 'root'
})
export class BleDevicesService {

  private baseUrl = "http://192.168.0.16:5000/api"

  constructor(private http:HttpClient) { }

  getLastDetectionByAgent(agent_name: string): Observable<BleDevice[]> {
    
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-API-KEY': '582K1D9FS-B2bFjfUbUf0w'
    });
    
    return this.http.get<BleDevicesResponse>(`${this.baseUrl}/ble/last_detection_by_agent/${agent_name}`, {
      headers:header
    }).pipe( 
      map(response => {
        const bleDevices = response.ble_devices;
    
        return bleDevices.map(device => {
          delete device['_id']; // Eliminamos la propiedad _id de la respuesta
    
          const detections = device.detections.map(detection => {
            const { agent_localization, ...detectionData } = detection; // Eliminamos la propiedad agent_localization de la respuesta
    
            const localization: Localization = {
              latitude: agent_localization.latitude,
              longitude: agent_localization.longitude
            };
    
            const mappedDetection: Detection = {
              ...detectionData,
              agent_localization: localization
            };
    
            return mappedDetection;
          });
    
          const mappedDevice: BleDevice = {
            ...device,
            detections: detections
          };
    
          return mappedDevice;
        });
      }),
      catchError(error => {
        console.log("Error en la llamada HTTP: ", error);
        return throwError("Ocurrió un error al intentar obtener los dispositivos BLE.");
      })
    );
  }

}
