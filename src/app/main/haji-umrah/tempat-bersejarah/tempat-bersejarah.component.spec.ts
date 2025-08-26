import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempatBersejarahComponent } from './tempat-bersejarah.component';

describe('TempatBersejarahComponent', () => {
  let component: TempatBersejarahComponent;
  let fixture: ComponentFixture<TempatBersejarahComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempatBersejarahComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TempatBersejarahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
