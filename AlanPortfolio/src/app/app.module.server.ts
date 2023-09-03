import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppComponent } from './app.component';
import { bootstrapApplication, platformBrowser } from '@angular/platform-browser';
import { ServerComponent } from './server/server.component';

@NgModule({
    imports: [
        ServerModule
    ],
    providers: [
        // Add server-only providers here.
    ],
    bootstrap: [ServerComponent]
})
export class AppServerModule { }




