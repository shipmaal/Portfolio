import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PianoService } from '@services';

@Component({
  selector: 'ui-mute-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mute-button.component.html',
  styleUrl: './mute-button.component.scss'
})
export class MuteButtonComponent implements OnInit {
  dashArray = 36; // Length of the path
  dashOffset = 0; // Fully drawn initially
  isShrinking = false;
  muteState = true;

  constructor(private pianoService: PianoService) {}

  ngOnInit() {
    this.pianoService.getAudioState().subscribe((state) => {
      this.muteState = state;
    });
  }

  toggleShrinkGrow() {
      console.log('Audio state:', this.muteState);
      this.pianoService.sendAudioState(!this.muteState);
      this.dashOffset = this.isShrinking ? 0 : this.dashArray;
      this.isShrinking = !this.isShrinking;
  }
}
