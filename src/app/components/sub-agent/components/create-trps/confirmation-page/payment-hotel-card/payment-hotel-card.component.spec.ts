import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentHotelCardComponent } from './payment-hotel-card.component';

describe('PaymentHotelCardComponent', () => {
  let component: PaymentHotelCardComponent;
  let fixture: ComponentFixture<PaymentHotelCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentHotelCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentHotelCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
