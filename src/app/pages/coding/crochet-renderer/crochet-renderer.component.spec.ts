import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrochetRendererComponent } from './crochet-renderer.component';

describe('CrochetRendererComponent', () => {
  let component: CrochetRendererComponent;
  let fixture: ComponentFixture<CrochetRendererComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrochetRendererComponent]
    });
    fixture = TestBed.createComponent(CrochetRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
