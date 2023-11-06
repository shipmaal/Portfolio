import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElementService } from '@services/element.service';
import { ContentComponent } from './content/content.component';


interface MenuItem {
    name: string;
    id: string;
    contentId: string;
    component: string;
}


@Component({
    selector: 'app-coding',
    standalone: true,
    imports: [CommonModule, ContentComponent],
    templateUrl: './coding.component.html',
    styleUrls: ['./coding.component.scss']
})
export class CodingComponent {
    contentContainerStyle!: { [key: string]: string };
    siderContainerStyle!: { [key: string]: string };
    siderStyle!: { [key: string]: string };
    siderWidth!: number;

    menuItems: MenuItem[] = [
        "Portfolio",
        "Crochet Renderer",
        "Music Analysis",
        "Map Maker",
    ].map(item => {
        return {
            name: item,
            id: `${item.replace(' ', '-').toLowerCase()}`,
            contentId: `${item.replace(' ', '-').toLowerCase()}-content`,
            component: `${item.replace(' ', '')}Component`
        }
    });


    formatMenuItem(item: MenuItem) {
        const sidebar = document.getElementById(item.id);
        const menuItems = document.querySelectorAll(".menu-item");
        if (menuItems) {
            menuItems.forEach((menuItem) => {
                menuItem.classList.remove('underline');
            });
        }

        sidebar?.classList.add('underline');
    }

  
    constructor(private elementService: ElementService) {
        this.elementService.getHeaderInfo().subscribe((width: number) => {
            this.siderWidth = (screen.availWidth - width) / 2;

            this.contentContainerStyle = {
                'width': `${width}px`,
            }

            this.siderContainerStyle = {
                'width': `${this.siderWidth}px`,
            }
        });

        window.addEventListener('scroll', () => this.scrollFunction(this.menuItems));
    }


    onSiderClick(item: MenuItem) {
        const content = document.getElementById(item.contentId)!;
        content.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }
    

    scrollFunction(menuItems: MenuItem[]) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const sidebar = document.getElementById('sider');
        const sideContainer = document.getElementById('sider-container');

        for (let i = 0; i < menuItems.length; i++) {
            const content = document.getElementById(menuItems[i].contentId)!;
            const contentTop = content.offsetTop - 32;
            const contentBottom = contentTop + content.offsetHeight - content.scrollHeight / 2;

            if (scrollTop >= contentTop && scrollTop < contentBottom) {
                this.formatMenuItem(menuItems[i]);
            }
        }

        if (sidebar && sideContainer) {
            const sidebarTop = sideContainer.offsetTop;
            if (scrollTop > sidebarTop) {
                sidebar.classList.add('fixed');
            } else {
                sidebar.classList.remove('fixed');
            }
        }
    }

   

}
