import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBookingListComponent } from './filter-booking-list.component';

describe('FilterBookingListComponent', () => {
  let component: FilterBookingListComponent;
  let fixture: ComponentFixture<FilterBookingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterBookingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterBookingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
