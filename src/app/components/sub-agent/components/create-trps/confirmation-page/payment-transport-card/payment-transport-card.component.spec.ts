import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTransportCardComponent } from './payment-transport-card.component';

describe('PaymentTransportCardComponent', () => {
  let component: PaymentTransportCardComponent;
  let fixture: ComponentFixture<PaymentTransportCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentTransportCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTransportCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
