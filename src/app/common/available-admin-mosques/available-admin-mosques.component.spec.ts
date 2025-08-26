import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableAdminMosquesComponent } from './available-admin-mosques.component';

describe('AvailableAdminMosquesComponent', () => {
  let component: AvailableAdminMosquesComponent;
  let fixture: ComponentFixture<AvailableAdminMosquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvailableAdminMosquesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableAdminMosquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
