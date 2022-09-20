import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaRequestsComponent } from './visa-requests.component';

describe('VisaRequestsComponent', () => {
  let component: VisaRequestsComponent;
  let fixture: ComponentFixture<VisaRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisaRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisaRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
