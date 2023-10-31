import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElementService } from '@services/element.service';

@Component({
    selector: 'content-container',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './content-container.component.html',
    styleUrls: ['./content-container.component.scss']
})
export class ContentContainerComponent {
    headerWidth: number | undefined;
    subContainerStyle!: { [key: string]: string };

    constructor(private elementService: ElementService) {
        this.elementService.getHeaderInfo().subscribe((width: number) => {
            this.headerWidth = width;
            this.subContainerStyle = {
                'width': `${this.headerWidth}px`,
            }
        });
    }
}
