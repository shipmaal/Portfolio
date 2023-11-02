import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentContainerComponent } from '@templates/content-container/content-container.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ContentContainerComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {

}
