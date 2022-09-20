import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaSubmissionComponent } from './visa-submission.component';

describe('VisaSubmissionComponent', () => {
  let component: VisaSubmissionComponent;
  let fixture: ComponentFixture<VisaSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisaSubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisaSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
