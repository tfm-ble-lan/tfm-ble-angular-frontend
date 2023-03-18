import { TestBed } from '@angular/core/testing';

import { MapDrawerService } from './map-drawer.service';

describe('MapDrawerService', () => {
  let service: MapDrawerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapDrawerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
