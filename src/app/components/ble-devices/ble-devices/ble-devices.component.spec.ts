import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BleDevicesComponent } from './ble-devices.component';

describe('BleDevicesComponent', () => {
  let component: BleDevicesComponent;
  let fixture: ComponentFixture<BleDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BleDevicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BleDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
