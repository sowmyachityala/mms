import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKeyMemberComponent } from './add-key-member.component';

describe('AddKeyMemberComponent', () => {
  let component: AddKeyMemberComponent;
  let fixture: ComponentFixture<AddKeyMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddKeyMemberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddKeyMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
