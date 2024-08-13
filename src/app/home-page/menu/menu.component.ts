import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PianoService } from '@services/piano.service';
import { filter } from 'rxjs';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    constructor(private pianoService: PianoService, private router: Router) { }

    menuController: MenuController = new MenuController(this.pianoService, 5, 5);
    
    menuItems = this.menuController.menuItems;
    buttonStyle = Array(5).fill('hidden');
    buttonStatus = Array(5).fill(false);

    keyStates = Array(5).fill(false);

    clientX = 0;
    clientY = 0;

    controllerStates: { [key: string]: boolean[] } = {
        "keyAction": Array(5).fill(false), // true: request for keydown, false: request for keyup
        "keyStates": Array(5).fill(false), // true: key is down, false: key is up
        "button": Array(5).fill(false), // true: mouse is over menu button, false: mouse not
    }

    ngOnInit(): void {
        this.pianoService.getMenuEvent().pipe(
            filter((event: [number, boolean, 'menu' | 'piano']) => event[2] === 'piano')
        ).subscribe((event: [number, boolean, 'menu' | 'piano']) => { // [key, down]
            this.controllerStates["keyAction"][event[0]] = event[1]; // index of key is set to appropriate action
            console.log('event', event);
            this.menuController.update(event[0], event[1], 'key');
        });
        
        // Mouse event listeners for menu buttons
        // Used for routing to different pages
        // Could also just use a elements in html
        // window.addEventListener('click', (event: MouseEvent) => {
        //     const index = this.controllerStates["keyStates"].indexOf(true);
        //     if (index !== -1) {
        //         this.onClick(index);
        //     }
        // });

        window.addEventListener('mousemove', (event: MouseEvent) => {
            this.clientX = event.clientX;
            this.clientY = event.clientY;
            this.menuController.updateAnchor(this.clientX, this.clientY);
        });

        window.addEventListener('scroll', (event: Event) => {
            const x = this.clientX;
            const y = this.clientY;
            this.menuController.updateAnchor(x, y);
        });
    }

    // onMouseEnter(index: number) {
    //     this.menuController.onMouseEnter(index);
    // }

    // onMouseLeave(index: number) {
    //     this.menuController.onMouseLeave(index);
    // }

    onClick(index: number) {
        const page = this.menuItems[index].link;
        this.router.navigate([page]);
    }
}


class MenuController {
    public buttonStyles: string[] = Array(5).fill('hidden');
    public menuItems = [
        { label: "About Me", link: "/about" },
        { label: "Education", link: "/education" },
        { label: "Coding Experience", link: "/coding" },
        { label: "Music Experience", link: "/music" },
        { label: "Contact Me", link: "/contact" }
    ];

    private states: { [key: string]: boolean[] };
    private anchor: HTMLAnchorElement | null = null;
  
    constructor(private pianoService: PianoService, 
                numKeys: number, 
                numButtons: number) {
      this.states = {'key': Array(numKeys).fill(false), 'button': Array(numKeys).fill(false)};
    }
  
    public update(index: number, status: boolean, type: 'key' | 'button') {
        console.log(type)
        this.updateMenu(index, status, type);
    }
    
    private updateMenu(index: number, status: boolean, type: 'key' | 'button') {
        if (index >= 0) {
            this.states[type][index] = status;
        }
        const keyStates = this.states['key'];
        const buttonStates = this.states['button'];
        console.log('Updating menu with key states:', keyStates);
        console.log('Updating menu with button states:', buttonStates);
        // moving anchor
        keyStates[index] ? this.showAnchor(this.menuItems[index].link, window.screenX / 2, window.screenY / 2) : this.hideAnchor();
        
        // toggling button visibility


        if (!(type === 'key' && !status && buttonStates[index])) {
            this.buttonStyles[index] = keyStates[index] ? 'visible' : 'hidden';
            this.pianoService.sendMenuEvent(index, keyStates[index], 'menu');

            if (keyStates.indexOf(true) !== buttonStates.indexOf(true) && buttonStates.indexOf(true) !== -1) {
                this.pianoService.sendMenuEvent(buttonStates.indexOf(true), false, 'menu');
                this.buttonStyles[buttonStates.indexOf(true)] = 'hidden';
                this.states['button'][buttonStates.indexOf(true)] = false;
            } 
        } 
        if (index < 0) {
            console.log('hi mom')
            this.pianoService.sendMenuEvent(index, status, 'menu');
        }
    }
  
    public getKeyStates(): boolean[] {
      return this.states['key'];
    }
  
    public getButtonStates(): boolean[] {
      return this.states['button'];
    }

    public onMouseEnter(index: number) {
        this.update(index, true, 'button');
    }

    public onMouseLeave(index: number) {
        this.update(index, false, 'button');
    }

    private showAnchor(link: string, x: number, y: number): void {
        if (!this.anchor) {
            this.anchor = document.createElement('a');
            this.anchor.style.position = 'absolute';
            this.anchor.style.width = '10px';
            this.anchor.style.height = '10px';
            this.anchor.style.opacity = '0';
            document.body.appendChild(this.anchor);
        }
        this.anchor.href = link;
        this.anchor.style.left = `${x}px`;
        this.anchor.style.top = `${y}px`;
    }

    private hideAnchor(): void {
        if (this.anchor) {
            document.body.removeChild(this.anchor);
            this.anchor = null;
        }
    }

    public updateAnchor(x: number, y: number): void {
        if (this.anchor) {
            this.anchor.style.left = `${x  + window.screenX}px`;
            this.anchor.style.top = `${y + window.scrollY}px`;
        }
    }
}
