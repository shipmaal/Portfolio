import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentContainerComponent } from '@templates/content-container/content-container.component';

@Component({
  selector: 'app-education',
  standalone: true,
    imports: [CommonModule, ContentContainerComponent],
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent {

}
