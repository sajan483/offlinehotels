import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryShimmerComponent } from './itinerary-shimmer.component';

describe('ItineraryShimmerComponent', () => {
  let component: ItineraryShimmerComponent;
  let fixture: ComponentFixture<ItineraryShimmerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItineraryShimmerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItineraryShimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
