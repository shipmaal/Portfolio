import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuService } from '@services';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  public buttonStyles: string[];
  public menuItems: { label: string, link: string }[];

  constructor(private menuService: MenuService) { 
    this.menuItems = menuService.menuItems;
    this.buttonStyles = menuService.buttonStyles;
  }

  onMouseEnter(index: number) {
    this.menuService.onMouseEnter(index);
  }

  onMouseLeave(index: number) {
    this.menuService.onMouseLeave(index);
  }
}
