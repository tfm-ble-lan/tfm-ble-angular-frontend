import { Injectable } from '@angular/core';
import { Injector } from '@angular/core';
import { MyMapComponent } from 'src/app/components/my-map/my-map.component';

@Injectable({
  providedIn: 'root'
})
export class MapDrawerService {

  private mapComponent: MyMapComponent;

  constructor(private injector: Injector) {
  }
  

}
