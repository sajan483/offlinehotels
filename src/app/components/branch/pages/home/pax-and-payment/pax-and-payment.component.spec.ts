import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaxAndPaymentComponent } from './pax-and-payment.component';

describe('PaxAndPaymentComponent', () => {
  let component: PaxAndPaymentComponent;
  let fixture: ComponentFixture<PaxAndPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaxAndPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaxAndPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
