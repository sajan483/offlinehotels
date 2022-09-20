import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportCancellationPolicyComponent } from './transport-cancellation-policy.component';

describe('TransportCancellationPolicyComponent', () => {
  let component: TransportCancellationPolicyComponent;
  let fixture: ComponentFixture<TransportCancellationPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportCancellationPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportCancellationPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
