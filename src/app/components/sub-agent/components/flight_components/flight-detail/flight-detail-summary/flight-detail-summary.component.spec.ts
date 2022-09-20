import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightDetailSummaryComponent } from './flight-detail-summary.component';

describe('FlightDetailSummaryComponent', () => {
  let component: FlightDetailSummaryComponent;
  let fixture: ComponentFixture<FlightDetailSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightDetailSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightDetailSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
