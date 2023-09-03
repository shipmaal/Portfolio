import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PianoService } from './../../piano.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements AfterViewInit {
    loadEventSub!: Subscription;
    containerTop = "0";

    constructor(private pianoService: PianoService) {

    }

    ngAfterViewInit() {
        this.loadEventSub = this.pianoService.getLoadEvent().subscribe(() => {
            this.containerTop = "-100vh";
        })
    }

}
