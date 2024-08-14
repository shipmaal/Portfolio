import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { NgStyle } from '@angular/common';
import { HeaderComponent } from './header/header.component'
import { FooterComponent } from './footer/footer.component';
import { HomePageComponent } from './home-page/home-page.component';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, NgStyle, HomePageComponent, HeaderComponent, FooterComponent]
})
export class AppComponent implements OnInit, OnDestroy {
    bodyWidth: { [key: string]: string } = {'width': '1132px'};
    loading = false;
    contentHeight: string = 'auto';
    @ViewChild('contentContainer') contentContainer!: ElementRef;

    routerSubscription!: Subscription;
  
    constructor(private router: Router) {}
  
    ngOnInit(): void {
      // this.updateBodyWidth(this.router.url);
      this.routerSubscription = this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.updateBodyWidth(event.urlAfterRedirects);
        }
      });
    }
  
    ngOnDestroy(): void {
      if (this.routerSubscription) {
        this.routerSubscription.unsubscribe();
      }
    }
  
    private updateBodyWidth(url: string): void {
        this.bodyWidth = url === '/' ? { 'width': '100%' } : { 'width': '1132px' };
    }
}
