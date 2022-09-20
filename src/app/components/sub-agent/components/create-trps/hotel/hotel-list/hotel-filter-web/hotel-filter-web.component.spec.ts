import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelFilterWebComponent } from './hotel-filter-web.component';

describe('HotelFilterWebComponent', () => {
  let component: HotelFilterWebComponent;
  let fixture: ComponentFixture<HotelFilterWebComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelFilterWebComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelFilterWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
