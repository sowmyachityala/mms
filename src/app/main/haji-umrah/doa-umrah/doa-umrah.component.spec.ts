import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoaUmrahComponent } from './doa-umrah.component';

describe('DoaUmrahComponent', () => {
  let component: DoaUmrahComponent;
  let fixture: ComponentFixture<DoaUmrahComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoaUmrahComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoaUmrahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
