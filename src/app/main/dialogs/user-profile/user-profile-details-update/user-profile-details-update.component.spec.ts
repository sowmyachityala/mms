import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileDetailsUpdateComponent } from './user-profile-details-update.component';

describe('UserProfileDetailsUpdateComponent', () => {
  let component: UserProfileDetailsUpdateComponent;
  let fixture: ComponentFixture<UserProfileDetailsUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProfileDetailsUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileDetailsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
