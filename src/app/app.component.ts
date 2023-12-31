import { Component } from '@angular/core';

import { NgSwitch, NgSwitchDefault, NgSwitchCase } from '@angular/common';
import { HeaderComponent } from './header/header.component'
import { FooterComponent } from './footer/footer.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RouterModule } from '@angular/router';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [NgSwitch, NgSwitchDefault, NgSwitchCase, HomePageComponent, HeaderComponent, FooterComponent, RouterModule]
})
export class AppComponent {
    title = 'AlanPortfolio';
}


