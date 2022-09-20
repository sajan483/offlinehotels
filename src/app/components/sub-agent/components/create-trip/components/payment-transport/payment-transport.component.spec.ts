import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTransportComponent } from './payment-transport.component';

describe('PaymentTransportComponent', () => {
  let component: PaymentTransportComponent;
  let fixture: ComponentFixture<PaymentTransportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentTransportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
