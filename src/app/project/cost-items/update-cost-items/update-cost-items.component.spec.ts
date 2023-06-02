import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCostItemsComponent } from './update-cost-items.component';

describe('UpdateCostItemsComponent', () => {
  let component: UpdateCostItemsComponent;
  let fixture: ComponentFixture<UpdateCostItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCostItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCostItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
