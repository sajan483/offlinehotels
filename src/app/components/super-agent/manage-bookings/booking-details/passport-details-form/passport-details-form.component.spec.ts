import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassportDetailsFormComponent } from './passport-details-form.component';

describe('PassportDetailsFormComponent', () => {
  let component: PassportDetailsFormComponent;
  let fixture: ComponentFixture<PassportDetailsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassportDetailsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassportDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
