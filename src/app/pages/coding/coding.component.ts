import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentContainerComponent } from '@templates/content-container/content-container.component';
import { ElementService } from '@services/element.service';


interface MenuItem {
    id: string;
    contentId: string;
}

@Component({
  selector: 'app-coding',
    standalone: true,
    imports: [CommonModule, ContentContainerComponent],
  templateUrl: './coding.component.html',
  styleUrls: ['./coding.component.scss']
})
export class CodingComponent {
    contentContainerStyle!: { [key: string]: string };
    siderContainerStyle!: { [key: string]: string };
    siderStyle!: { [key: string]: string };
    contentWidth!: number;
    siderWidth!: number;

    menuItems: MenuItem[] = [
        "Portfolio",
        "Crochet Renderer",
        "Music Analysis",
        "Map Maker",
    ].map(item => {
        return { id: item, contentId: `${item.replace(' ', '-').toLowerCase()}-content` }
    });
  
    constructor(private elementService: ElementService) {
        console.log(this.menuItems)
        this.elementService.getHeaderInfo().subscribe((width: number) => {
            this.contentWidth = width;
            this.siderWidth = (screen.availWidth - width) / 2;

            this.contentContainerStyle = {
                'width': `${width}px`,
            }

            this.siderContainerStyle = {
                'width': `${this.siderWidth}px`,
            }
        });

        window.addEventListener('scroll', this.scrollFunction);
    }


    onSiderClick(item: MenuItem) {
        const element = document.getElementById(item.contentId)!;
        element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }

    
    scrollFunction() {
        const sidebar = document.getElementById('sider');
        if (sidebar) {

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const sidebarTop = sidebar.offsetTop;
            if (scrollTop > sidebarTop) {
                sidebar.classList.add('fixed');
            } else {
                sidebar.classList.remove('fixed');
            }
        }
    }


}
