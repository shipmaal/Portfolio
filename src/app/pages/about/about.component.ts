import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';



import { ContentContainerComponent } from '@templates/content-container/content-container.component';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule, NgOptimizedImage, ContentContainerComponent],
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent {
    
}
