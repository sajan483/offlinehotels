import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelDetailsPopupComponent } from './hotel-details-popup.component';

describe('HotelDetailsPopupComponent', () => {
  let component: HotelDetailsPopupComponent;
  let fixture: ComponentFixture<HotelDetailsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelDetailsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
