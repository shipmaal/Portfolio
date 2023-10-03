import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { NgSwitch, NgSwitchDefault, NgSwitchCase } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HomePageComponent } from './home-page/home-page.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component'


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


if (typeof Worker !== 'undefined') {
  // Create a new
  const worker = new Worker(new URL('./app.worker', import.meta.url));
  worker.onmessage = ({ data }) => {
    console.log(`page got message: ${data}`);
  };
  worker.postMessage('hello');
} else {
  // Web Workers are not supported in this environment.
  // You should add a fallback so that your program still executes correctly.
}