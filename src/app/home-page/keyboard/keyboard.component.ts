import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThreeService } from '@services';
import { MuteButtonComponent } from '@ui';


@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
  imports: [CommonModule, MuteButtonComponent],
  standalone: true
})
export class KeyboardComponent implements OnInit, AfterViewInit, OnDestroy {
  canvasStyle;

  constructor(private threeService: ThreeService) {
    this.canvasStyle = {
     'cursor': threeService.cursorStyle(),
     'top': threeService.topStyle()
    };
   }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.threeService.init();
  }

  ngOnDestroy() { 
    this.threeService.destroy();
  }
}
