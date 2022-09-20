import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RailTravellerInfoItemComponent } from './rail-traveller-info-item.component';

describe('RailTravellerInfoItemComponent', () => {
  let component: RailTravellerInfoItemComponent;
  let fixture: ComponentFixture<RailTravellerInfoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RailTravellerInfoItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RailTravellerInfoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
