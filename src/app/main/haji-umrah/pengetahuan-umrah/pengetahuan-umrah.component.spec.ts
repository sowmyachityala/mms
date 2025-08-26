import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PengetahuanUmrahComponent } from './pengetahuan-umrah.component';

describe('PengetahuanUmrahComponent', () => {
  let component: PengetahuanUmrahComponent;
  let fixture: ComponentFixture<PengetahuanUmrahComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PengetahuanUmrahComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PengetahuanUmrahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
