import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateCategoriesComponent } from './add-update-categories.component';

describe('AddUpdateCategoriesComponent', () => {
  let component: AddUpdateCategoriesComponent;
  let fixture: ComponentFixture<AddUpdateCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateCategoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
