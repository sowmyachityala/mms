import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryProfileComponent } from './ministry-profile.component';

describe('MinistryProfileComponent', () => {
  let component: MinistryProfileComponent;
  let fixture: ComponentFixture<MinistryProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinistryProfileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MinistryProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
