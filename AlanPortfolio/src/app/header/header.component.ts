import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

import { PianoService } from './../piano.service'
import { Subscription } from 'rxjs'
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit {
    loadEventSub!: Subscription;
    headerClass: string[] = ["container"];
    titleMargin = "5vh 0 0 0"
    currentRoute!: string;

    constructor(private lidService: PianoService, private router: Router) {
        this.currentRoute = this.router.url;

        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.currentRoute = this.router.url;
        })
    }


    ngAfterViewInit() {
        this.loadEventSub = this.lidService.getLoadEvent().subscribe(() => {
            this.headerClass.push("rotate", "sticky");
    })
        
        
        window.addEventListener('scroll', this.scrollFunction);

    }

    private scrollFunction = () => {
        const height = 24;
        if (window.scrollY > height) {
            this.titleMargin = "1vh 0 1vh 0";
        } else {
            this.titleMargin = "5vh 0 0 0";
        }

    }

}
