import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyMembersComponent } from './key-members.component';

describe('KeyMembersComponent', () => {
  let component: KeyMembersComponent;
  let fixture: ComponentFixture<KeyMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyMembersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
