import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMappingComponent } from './menu-mapping.component';

describe('MenuMappingComponent', () => {
  let component: MenuMappingComponent;
  let fixture: ComponentFixture<MenuMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuMappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
