import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendBookingRequestComponent } from './send-booking-request.component';

describe('SendBookingRequestComponent', () => {
  let component: SendBookingRequestComponent;
  let fixture: ComponentFixture<SendBookingRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendBookingRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendBookingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
