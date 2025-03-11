import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsCategoryManagementComponent } from './os-category-management.component';

describe('OsCategoryManagementComponent', () => {
  let component: OsCategoryManagementComponent;
  let fixture: ComponentFixture<OsCategoryManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OsCategoryManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OsCategoryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
