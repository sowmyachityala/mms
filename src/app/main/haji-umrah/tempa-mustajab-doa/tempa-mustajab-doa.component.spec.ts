import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempaMustajabDoaComponent } from './tempa-mustajab-doa.component';

describe('TempaMustajabDoaComponent', () => {
  let component: TempaMustajabDoaComponent;
  let fixture: ComponentFixture<TempaMustajabDoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempaMustajabDoaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TempaMustajabDoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
