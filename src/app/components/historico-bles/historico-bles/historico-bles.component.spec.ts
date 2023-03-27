import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoBlesComponent } from './historico-bles.component';

describe('HistoricoBlesComponent', () => {
  let component: HistoricoBlesComponent;
  let fixture: ComponentFixture<HistoricoBlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricoBlesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoBlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
