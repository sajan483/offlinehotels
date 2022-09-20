import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryTransportCardComponent } from './itinerary-transport-card.component';

describe('ItineraryTransportCardComponent', () => {
  let component: ItineraryTransportCardComponent;
  let fixture: ComponentFixture<ItineraryTransportCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItineraryTransportCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItineraryTransportCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
