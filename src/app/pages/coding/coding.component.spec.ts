import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodingComponent } from './coding.component';

describe('CodingComponent', () => {
  let component: CodingComponent;
  let fixture: ComponentFixture<CodingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CodingComponent]
    });
    fixture = TestBed.createComponent(CodingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
