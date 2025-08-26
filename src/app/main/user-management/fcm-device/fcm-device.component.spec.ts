import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcmDeviceComponent } from './fcm-device.component';

describe('FcmDeviceComponent', () => {
  let component: FcmDeviceComponent;
  let fixture: ComponentFixture<FcmDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FcmDeviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FcmDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
