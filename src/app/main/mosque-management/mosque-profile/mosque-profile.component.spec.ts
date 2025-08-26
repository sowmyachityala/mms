import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MosqueProfileComponent } from './mosque-profile.component';

describe('MosqueProfileComponent', () => {
  let component: MosqueProfileComponent;
  let fixture: ComponentFixture<MosqueProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MosqueProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MosqueProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
