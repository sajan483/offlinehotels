import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportCardComponent } from './transport-card.component';

describe('TransportCardComponent', () => {
  let component: TransportCardComponent;
  let fixture: ComponentFixture<TransportCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
