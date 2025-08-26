import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinasiComponent } from './destinasi.component';

describe('DestinasiComponent', () => {
  let component: DestinasiComponent;
  let fixture: ComponentFixture<DestinasiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinasiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestinasiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
