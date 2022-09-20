import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDetailCardComponent } from './flight-detail-card.component';

describe('FlightDetailCardComponent', () => {
  let component: FlightDetailCardComponent;
  let fixture: ComponentFixture<FlightDetailCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightDetailCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
