import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelationPopupComponent } from './cancelation-popup.component';

describe('CancelationPopupComponent', () => {
  let component: CancelationPopupComponent;
  let fixture: ComponentFixture<CancelationPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelationPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
