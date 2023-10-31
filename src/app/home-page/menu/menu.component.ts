import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PianoService } from '@services/piano.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    constructor(private pianoService: PianoService, private router: Router) { }

    ngOnInit(): void {
        this.menuEventSub();
        
        window.addEventListener('click', (event: MouseEvent) => {
            const index = this.controllerStates["keyStates"].indexOf(true);
            if (index !== -1) {
                this.onClick(index);
            }
        });
    }

    
    menuItems = [
        { label: "About Me", link: "/about" },
        { label: "Education", link: "/education" },
        { label: "Coding Experience", link: "/coding" },
        { label: "Music  Experience", link: "/music" },
        { label: "Contact Me", link: "/contact" }
    ];
    buttonStyle: string[] = Array(5).fill('hidden');

    controllerStates: { [key: string]: boolean[] } = {
        "keyAction": Array(5).fill(false), // true: request for keydown, false: request for keyup
        "keyStates": Array(5).fill(false), // true: key is down, false: key is up
        "button": Array(5).fill(false), // true: mouse is over menu button, false: mouse not
    }


    menuController() {
        const actions = this.controllerStates["keyAction"];
        const states = this.controllerStates["keyStates"];

        const actionIndex = actions.indexOf(true);
        if (actionIndex !== -1 && !states[actionIndex]) {
            this.pianoService.sendMouseState('pointer');
            this.keyAction(actionIndex, true);
        }

        const buttonIndex = this.controllerStates["button"].indexOf(true);
        
        const pressedIndex = this.controllerStates["keyStates"].indexOf(true);
        if (this.getAllIndexes(actions, false).includes(pressedIndex)) {
            if (buttonIndex === -1) {
                this.pianoService.sendMouseState('default');
                this.keyAction(pressedIndex, false);
            } 
        }
    }


    keyAction(index: number, keyStatus: boolean) {
        const elementStates = ["hidden", "visible"];
        this.controllerStates["keyStates"][index] = keyStatus;
        this.buttonStyle[index] = elementStates[Number(keyStatus)];
    }


    menuEventSub() {
        this.pianoService.getMenuEvent().subscribe((event: [number, boolean]) => { // [key, down]
            this.controllerStates["keyAction"][event[0]] = event[1]; // index of key is set to appropriate action
            this.menuController();
        });
    }


    onMouseEnter(index: number) {
        this.controllerStates['button'][index] = true;
        this.menuController();
    }


    onMouseLeave(index: number) {
        this.controllerStates['button'][index] = false;
        this.menuController();
       
    }


    onClick(index: number) {
        const page = this.menuItems[index].link;
        this.router.navigate([page]);
    }

    
    getAllIndexes(arr: any[], val: any) {
        const indexes = [];
        for (let i = 0; i < arr.length; i++)
            if (arr[i] === val)
                indexes.push(i);
        return indexes;
    }
}
