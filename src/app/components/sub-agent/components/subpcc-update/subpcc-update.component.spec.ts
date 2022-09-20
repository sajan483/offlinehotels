import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpccUpdateComponent } from './subpcc-update.component';

describe('SubpccUpdateComponent', () => {
  let component: SubpccUpdateComponent;
  let fixture: ComponentFixture<SubpccUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubpccUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubpccUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
