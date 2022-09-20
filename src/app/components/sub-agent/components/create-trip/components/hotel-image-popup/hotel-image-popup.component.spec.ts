import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelImagePopupComponent } from './hotel-image-popup.component';

describe('HotelImagePopupComponent', () => {
  let component: HotelImagePopupComponent;
  let fixture: ComponentFixture<HotelImagePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelImagePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelImagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
