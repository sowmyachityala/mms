import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMosquesComponent } from './admin-mosques.component';

describe('AdminMosquesComponent', () => {
  let component: AdminMosquesComponent;
  let fixture: ComponentFixture<AdminMosquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminMosquesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMosquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
