import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappLoginComponent } from './whatsapp-login.component';

describe('WhatsappLoginComponent', () => {
  let component: WhatsappLoginComponent;
  let fixture: ComponentFixture<WhatsappLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsappLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsappLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
