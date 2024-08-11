import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';

import { Subscription } from 'rxjs';

import { KeyboardComponent } from './keyboard/keyboard.component';
import { TitleComponent } from './title/title.component';
import { MenuComponent } from './menu/menu.component';
import { PianoService } from '@services/piano.service';

@Component({
	selector: 'app-home-page',
	standalone: true,
	imports: [CommonModule, KeyboardComponent, TitleComponent, MenuComponent],
	templateUrl: './home-page.component.html',
	styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements AfterViewInit {
    headerClass: string[] = ["header", "animation"];
    loadEventSub!: Subscription;
    loaded = false;
    notLoaded = true;

    constructor(private pianoService: PianoService, private router: Router) {
    //     this.router.events.subscribe(event => {
    //         console.log(event);
    //         if (event instanceof NavigationStart || NavigationEnd) {
    //             this.headerClass = ["header"];
    //             setTimeout(() => {
    //                 this.headerClass.push("animation");
    //             }, 500);
    //         }
    //     });
    }

    ngAfterViewInit() {
        this.loadEventSub = this.pianoService.getLoadEvent().subscribe(() => {
            this.loaded = true;
            setTimeout(() => {
                this.notLoaded = false;
                this.headerClass.push("rotate");

            }, 1000);
        })
    }
}
