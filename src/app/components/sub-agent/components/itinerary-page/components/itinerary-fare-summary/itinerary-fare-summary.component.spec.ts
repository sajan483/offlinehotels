import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryFareSummaryComponent } from './itinerary-fare-summary.component';

describe('ItineraryFareSummaryComponent', () => {
  let component: ItineraryFareSummaryComponent;
  let fixture: ComponentFixture<ItineraryFareSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItineraryFareSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItineraryFareSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
