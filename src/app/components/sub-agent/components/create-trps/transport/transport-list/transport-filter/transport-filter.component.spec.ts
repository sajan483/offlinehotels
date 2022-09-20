import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportFilterComponent } from './transport-filter.component';

describe('TransportFilterComponent', () => {
  let component: TransportFilterComponent;
  let fixture: ComponentFixture<TransportFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
