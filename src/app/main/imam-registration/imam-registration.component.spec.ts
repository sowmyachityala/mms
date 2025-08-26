import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImamRegistrationComponent } from './imam-registration.component';

describe('ImamRegistrationComponent', () => {
  let component: ImamRegistrationComponent;
  let fixture: ComponentFixture<ImamRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImamRegistrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImamRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
