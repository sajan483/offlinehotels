import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelSortComponent } from './hotel-sort.component';

describe('HotelSortComponent', () => {
  let component: HotelSortComponent;
  let fixture: ComponentFixture<HotelSortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelSortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
