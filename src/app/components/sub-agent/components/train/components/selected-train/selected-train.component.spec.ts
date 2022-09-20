import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedTrainComponent } from './selected-train.component';

describe('SelectedTrainComponent', () => {
  let component: SelectedTrainComponent;
  let fixture: ComponentFixture<SelectedTrainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedTrainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
