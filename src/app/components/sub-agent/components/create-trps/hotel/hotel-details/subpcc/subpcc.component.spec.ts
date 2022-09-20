import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubpccComponent } from './subpcc.component';

describe('SubpccComponent', () => {
  let component: SubpccComponent;
  let fixture: ComponentFixture<SubpccComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubpccComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubpccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
