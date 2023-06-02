import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCostItemsComponent } from './register-cost-items.component';

describe('RegisterCostItemsComponent', () => {
  let component: RegisterCostItemsComponent;
  let fixture: ComponentFixture<RegisterCostItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterCostItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCostItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
