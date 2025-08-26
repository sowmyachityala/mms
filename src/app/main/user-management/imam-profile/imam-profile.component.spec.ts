import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImamProfileComponent } from './imam-profile.component';

describe('ImamProfileComponent', () => {
  let component: ImamProfileComponent;
  let fixture: ComponentFixture<ImamProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImamProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImamProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
