import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEnquiryBookingsComponent } from './view-enquiry-bookings.component';

describe('ViewEnquiryBookingsComponent', () => {
  let component: ViewEnquiryBookingsComponent;
  let fixture: ComponentFixture<ViewEnquiryBookingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEnquiryBookingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEnquiryBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
