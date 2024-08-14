import { Injectable } from '@angular/core';
import { PianoService } from '@services';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  public buttonStyles: string[] = Array(5).fill('hidden');
  public menuItems = [
    { label: "About Me", link: "/about" },
    { label: "Education", link: "/education" },
    { label: "Coding Experience", link: "/coding" },
    { label: "Music Experience", link: "/music" },
    { label: "Contact Me", link: "/contact" }
  ];

  private states: { [key: string]: boolean[] } = {'key': Array(5).fill(false), 
                    'down': Array(5).fill(false),
                    'button': Array(5).fill(false)
  };

  private anchor: HTMLAnchorElement | null = null;

  private clientX = 0;
  private clientY = 0;

  constructor(private pianoService: PianoService) {
    this.pianoService.getMenuEvent().pipe(
      filter((event: [number, boolean, 'menu' | 'piano']) => event[2] === 'piano')
    ).subscribe((event: [number, boolean, 'menu' | 'piano']) => { // [key, down]
      this.update(event[0], event[1], 'key');
    });
    window.addEventListener('mousemove', (event: MouseEvent) => {
      this.clientX = event.clientX;
      this.clientY = event.clientY;
      this.updateAnchor(this.clientX, this.clientY);
    });

    window.addEventListener('scroll', (event: Event) => {
      const x = this.clientX;
      const y = this.clientY;
      this.updateAnchor(x, y);
    });
  }

  public update(index: number, status: boolean, type: 'key' | 'button') {
    if (index >= 0) this.states[type][index] = status;
    const keyAction = this.states['key'];
    const buttonStates = this.states['button'];
    // moving anchor
    keyAction[index] ? this.showAnchor(this.menuItems[index].link, window.screenX / 2, window.screenY / 2) : this.hideAnchor();
    
    if (!(type === 'key' && !status && buttonStates[index])) {
        this.buttonStyles[index] = keyAction[index] ? 'visible' : 'hidden';
        if (keyAction[index] !== this.states['down'][index]) {
            this.pianoService.sendMenuEvent(index, keyAction[index], 'menu');
            this.states['down'][index] = keyAction[index];
        }

        if (keyAction.indexOf(true) !== buttonStates.indexOf(true) && buttonStates.indexOf(true) !== -1) {
          this.pianoService.sendMenuEvent(buttonStates.indexOf(true), false, 'menu');
          this.states['down'][index] = keyAction[index];

          this.buttonStyles[buttonStates.indexOf(true)] = 'hidden';
          this.states['button'][buttonStates.indexOf(true)] = false;
        } 
    } 
    if (index < 0) {
      this.pianoService.sendMenuEvent(index, status, 'menu');
      this.states['down'][index] = keyAction[index];
    }
  }

  public getKeyStates(): boolean[] {
    return this.states['key'];
  }

  public getButtonStates(): boolean[] {
    return this.states['button'];
  }

  public onMouseEnter(index: number) {
    console.log('mouse enter: ', index);
    this.update(index, true, 'button');
  }

  public onMouseLeave(index: number) {
    console.log('mouse leave: ', index);
    this.update(index, false, 'button');
  }

  private showAnchor(link: string, x: number, y: number): void {
    const size = 50
    if (!this.anchor) {
      this.anchor = document.createElement('a');
      this.anchor.style.position = 'absolute';
      this.anchor.style.width = `${size}px`;
      this.anchor.style.height = `${size}px`;
      this.anchor.style.opacity = '0';
      document.body.appendChild(this.anchor);
    }
    this.anchor.href = link;
    this.anchor.style.left = `${x - size / 2}px`;
    this.anchor.style.top = `${y - size / 2}px`;
  }

  private hideAnchor(): void {
    if (this.anchor) {
      document.body.removeChild(this.anchor);
      this.anchor = null;
    }
  }

  public updateAnchor(x: number, y: number): void {
    if (this.anchor) {
      this.anchor.style.left = `${x  + window.screenX - 25}px`;
      this.anchor.style.top = `${y + window.scrollY - 25}px`;
    }
  }
}
