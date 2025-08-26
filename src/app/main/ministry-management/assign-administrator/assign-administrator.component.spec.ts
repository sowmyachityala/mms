import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignAdministratorComponent } from './assign-administrator.component';

describe('AssignAdministratorComponent', () => {
  let component: AssignAdministratorComponent;
  let fixture: ComponentFixture<AssignAdministratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignAdministratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignAdministratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
