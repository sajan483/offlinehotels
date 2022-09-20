import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryPaxDetailsComponent } from './itinerary-pax-details.component';

describe('ItineraryPaxDetailsComponent', () => {
  let component: ItineraryPaxDetailsComponent;
  let fixture: ComponentFixture<ItineraryPaxDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItineraryPaxDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItineraryPaxDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
