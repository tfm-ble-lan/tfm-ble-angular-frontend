import { TestBed } from '@angular/core/testing';

import { BleDevicesService } from './ble-devices.service';

describe('BleDevicesService', () => {
  let service: BleDevicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BleDevicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
