import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicAnalysisComponent } from './music-analysis.component';

describe('MusicAnalysisComponent', () => {
  let component: MusicAnalysisComponent;
  let fixture: ComponentFixture<MusicAnalysisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MusicAnalysisComponent]
    });
    fixture = TestBed.createComponent(MusicAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
