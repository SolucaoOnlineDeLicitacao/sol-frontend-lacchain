import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostItemsComponent } from './cost-items.component';

describe('CostItemsComponent', () => {
  let component: CostItemsComponent;
  let fixture: ComponentFixture<CostItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
