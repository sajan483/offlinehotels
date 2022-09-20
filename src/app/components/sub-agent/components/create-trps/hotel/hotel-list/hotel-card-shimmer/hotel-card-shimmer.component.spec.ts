import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelCardShimmerComponent } from './hotel-card-shimmer.component';

describe('HotelCardShimmerComponent', () => {
  let component: HotelCardShimmerComponent;
  let fixture: ComponentFixture<HotelCardShimmerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelCardShimmerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelCardShimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
