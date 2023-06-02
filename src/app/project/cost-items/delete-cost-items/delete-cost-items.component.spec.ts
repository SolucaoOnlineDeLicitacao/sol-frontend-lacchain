import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCostItemsComponent } from './delete-cost-items.component';

describe('DeleteCostItemsComponent', () => {
  let component: DeleteCostItemsComponent;
  let fixture: ComponentFixture<DeleteCostItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteCostItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteCostItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
