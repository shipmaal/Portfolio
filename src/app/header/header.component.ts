import { Component, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

import { PianoService } from '@services/piano.service'
import { ElementService } from '@services/element.service'
import { Subscription } from 'rxjs'
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit, AfterViewChecked {
    loadEventSub!: Subscription;
    headerClass: string[] = ["header"];
    titleMargin = "2vh 0 0 0"
    currentRoute!: string;
    displayMenu = false;
    canvasStyle = { 'cursor': 'default', 'opacity': '100' };
    menuClass = Array(5).fill(["menu-item", ""]);
    prevHeaderWidth: number = 0;


    menuItems = [
        { label: "About Me", link: "/about" },
        { label: "Education", link: "/education" },
        { label: "Coding Experience", link: "/coding" },
        { label: "Music  Experience", link: "/music" },
        { label: "Contact Me", link: "/contact" }
    ];

    constructor(private lidService: PianoService, private elementService: ElementService, private router: Router) {
        this.currentRoute = this.router.url;

        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.currentRoute = this.router.url;
                this.menuClass = this.menuItems.map(item => [
                    "menu-item",
                    item.link === this.currentRoute ? "underline" : ""
                ]);


                if (this.currentRoute != '/') {
                    this.displayMenu = true;
                    
                    const animationIndex = this.headerClass.indexOf("animation");
                    if ((animationIndex) > -1) {
                        this.headerClass[animationIndex] = "rotate";
                    }
                    this.headerClass.push("rotate");
                } else {
                    this.displayMenu = false;
                    this.canvasStyle['opacity'] = '0';
                    this.headerClass = ["header"];

                    setTimeout(() => {
                        this.canvasStyle['opacity'] = '100';
                        this.headerClass.push("animation");

                    }, 500);
                }

            });


    }


    ngAfterViewInit() {
        this.loadEventSub = this.lidService.getLoadEvent().subscribe(() => {
            this.headerClass.push("rotate");
        })

        window.addEventListener('scroll', this.scrollFunction);

        
        //this.elementService.sendHeaderInfo(headerContainerWidth!);
    }

    ngAfterViewChecked() {
        const headerContainer = document.getElementById("container");
        if (headerContainer) {
            const headerContainerWidth = headerContainer.getBoundingClientRect().width;
            if (headerContainerWidth !== this.prevHeaderWidth) {
                this.prevHeaderWidth = headerContainerWidth;
                this.elementService.sendHeaderInfo(headerContainerWidth);
            }
        }
    }
    

    private scrollFunction = () => {
        //const height = 24;
        //if (window.scrollY > height) {
        //    this.titleMargin = "1vh 0 1vh 0";
        //} else {
        //    this.titleMargin = "2vh 0 0 0";
        //}
    }

    onMouseEnter(index: number) {
        if (this.displayMenu) {
            this.canvasStyle['cursor'] = 'pointer';
        }
    }


    onMouseLeave(index: number) {
        this.canvasStyle['cursor'] = 'default';
    }


    onClick(index: number) {
        console.log(index)
        if (index === -1) {
            this.router.navigate([''])
        }
        const page = this.menuItems[index].link
        this.router.navigate([page])
    }
}

