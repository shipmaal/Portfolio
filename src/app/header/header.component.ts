import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';

import { Subscription } from 'rxjs'

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    loadEventSub!: Subscription;
    headerClass: string[] = ["rotate"];
    titleMargin = "2vh 0 0 0"
    currentRoute!: string;
    doDisplay = true;
    canvasStyle = { 'cursor': 'default', 'opacity': '100' };
    menuClass = Array(5).fill(["menu-item", ""]);

    menuItems = [
        { label: "About Me", link: "/about" },
        { label: "Education", link: "/education" },
        { label: "Coding Experience", link: "/coding" },
        { label: "Music  Experience", link: "/music" },
        { label: "Contact Me", link: "/contact" }
    ];
    
    constructor(private router: Router) {
        this.currentRoute = this.router.url;
    }

    ngOnInit(): void {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.doDisplay = event.url !== "/";
                this.menuClass = this.menuItems.map(item => [
                    "menu-item",
                    item.link === event.url ? "underline" : ""
                ]);
            }
        });
    }
}

    