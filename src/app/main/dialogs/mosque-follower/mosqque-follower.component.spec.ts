import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MosqqueFollowerComponent } from './mosqque-follower.component';

describe('MosqqueFollowerComponent', () => {
  let component: MosqqueFollowerComponent;
  let fixture: ComponentFixture<MosqqueFollowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MosqqueFollowerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MosqqueFollowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
