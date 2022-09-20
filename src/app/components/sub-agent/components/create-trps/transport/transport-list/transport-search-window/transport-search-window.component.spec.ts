import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportSearchWindowComponent } from './transport-search-window.component';

describe('TransportSearchWindowComponent', () => {
  let component: TransportSearchWindowComponent;
  let fixture: ComponentFixture<TransportSearchWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportSearchWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportSearchWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
