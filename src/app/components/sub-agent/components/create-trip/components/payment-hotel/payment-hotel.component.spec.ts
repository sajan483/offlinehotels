import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentHotelComponent } from './payment-hotel.component';

describe('PaymentHotelComponent', () => {
  let component: PaymentHotelComponent;
  let fixture: ComponentFixture<PaymentHotelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentHotelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
