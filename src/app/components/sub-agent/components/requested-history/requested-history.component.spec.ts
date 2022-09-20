import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedHistoryComponent } from './requested-history.component';

describe('RequestedHistoryComponent', () => {
  let component: RequestedHistoryComponent;
  let fixture: ComponentFixture<RequestedHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestedHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestedHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
