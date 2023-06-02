import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostItemsDataComponent } from './cost-items-data.component';

describe('CostItemsDataComponent', () => {
  let component: CostItemsDataComponent;
  let fixture: ComponentFixture<CostItemsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostItemsDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostItemsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
