import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaHeaderComponent } from './visa-header.component';

describe('VisaHeaderComponent', () => {
  let component: VisaHeaderComponent;
  let fixture: ComponentFixture<VisaHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisaHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisaHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
