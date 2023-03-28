import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionAgentesComponent } from './administracion-agentes.component';

describe('AdministracionAgentesComponent', () => {
  let component: AdministracionAgentesComponent;
  let fixture: ComponentFixture<AdministracionAgentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionAgentesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionAgentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
