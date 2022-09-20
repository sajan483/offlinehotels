import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelSearchWindowComponent } from './hotel-search-window.component';

describe('HotelSearchWindowComponent', () => {
  let component: HotelSearchWindowComponent;
  let fixture: ComponentFixture<HotelSearchWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelSearchWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelSearchWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
