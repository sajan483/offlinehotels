import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundPolicyBarComponent } from './refund-policy-bar.component';

describe('RefundPolicyBarComponent', () => {
  let component: RefundPolicyBarComponent;
  let fixture: ComponentFixture<RefundPolicyBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundPolicyBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundPolicyBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
