import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderHotelPopupComponent } from './loader-hotel-popup.component';

describe('LoaderHotelPopupComponent', () => {
  let component: LoaderHotelPopupComponent;
  let fixture: ComponentFixture<LoaderHotelPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaderHotelPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderHotelPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
