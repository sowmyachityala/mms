import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IslamicPhrasesComponent } from './islamic-phrases.component';

describe('IslamicPhrasesComponent', () => {
  let component: IslamicPhrasesComponent;
  let fixture: ComponentFixture<IslamicPhrasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IslamicPhrasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IslamicPhrasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
