import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecievedBookingRequestComponent } from './recieved-booking-request.component';

describe('RecievedBookingRequestComponent', () => {
  let component: RecievedBookingRequestComponent;
  let fixture: ComponentFixture<RecievedBookingRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecievedBookingRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecievedBookingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
