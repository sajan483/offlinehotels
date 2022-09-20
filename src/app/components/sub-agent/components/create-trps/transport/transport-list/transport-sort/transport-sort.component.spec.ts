import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportSortComponent } from './transport-sort.component';

describe('TransportSortComponent', () => {
  let component: TransportSortComponent;
  let fixture: ComponentFixture<TransportSortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportSortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
