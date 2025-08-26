import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateMosqueComponent } from './add-update-mosque.component';

describe('AddUpdateMosqueComponent', () => {
  let component: AddUpdateMosqueComponent;
  let fixture: ComponentFixture<AddUpdateMosqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateMosqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateMosqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
