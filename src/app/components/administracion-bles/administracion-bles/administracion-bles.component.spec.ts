import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionBlesComponent } from './administracion-bles.component';

describe('AdministracionBlesComponent', () => {
  let component: AdministracionBlesComponent;
  let fixture: ComponentFixture<AdministracionBlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionBlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionBlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
