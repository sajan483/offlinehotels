import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainSelectorComponent } from './train-selector.component';

describe('TrainSelectorComponent', () => {
  let component: TrainSelectorComponent;
  let fixture: ComponentFixture<TrainSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
