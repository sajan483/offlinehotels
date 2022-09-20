import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryHotelCardComponent } from './itinerary-hotel-card.component';

describe('ItineraryHotelCardComponent', () => {
  let component: ItineraryHotelCardComponent;
  let fixture: ComponentFixture<ItineraryHotelCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItineraryHotelCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItineraryHotelCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
