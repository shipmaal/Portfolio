import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentContainerComponent } from '@templates/content-container/content-container.component';

@Component({
  selector: 'app-coding',
    standalone: true,
    imports: [CommonModule, ContentContainerComponent],
  templateUrl: './coding.component.html',
  styleUrls: ['./coding.component.scss']
})
export class CodingComponent {

}
