import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainShimmerComponent } from './train-shimmer.component';

describe('TrainShimmerComponent', () => {
  let component: TrainShimmerComponent;
  let fixture: ComponentFixture<TrainShimmerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainShimmerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainShimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
