import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainItineryComponent } from './train-itinery.component';

describe('TrainItineryComponent', () => {
  let component: TrainItineryComponent;
  let fixture: ComponentFixture<TrainItineryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainItineryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainItineryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
