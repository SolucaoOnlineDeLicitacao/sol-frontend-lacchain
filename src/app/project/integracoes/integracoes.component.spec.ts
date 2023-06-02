import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegracoesComponent } from './integracoes.component';

describe('IntegracoesComponent', () => {
  let component: IntegracoesComponent;
  let fixture: ComponentFixture<IntegracoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegracoesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegracoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
