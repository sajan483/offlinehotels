import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RailTravellerInfoComponent } from './rail-traveller-info.component';

describe('RailTravellerInfoComponent', () => {
  let component: RailTravellerInfoComponent;
  let fixture: ComponentFixture<RailTravellerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RailTravellerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RailTravellerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
