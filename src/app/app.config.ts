import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { APP_ROUTES } from "./app.router";
import { provideClientHydration } from "@angular/platform-browser";
import { HighlightOptions, HIGHLIGHT_OPTIONS } from "ngx-highlightjs";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(APP_ROUTES),
        provideClientHydration(),
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: <HighlightOptions>{
                lineNumbers: true,
                coreLibraryLoader: () => import('highlight.js/lib/core'),
                lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'),
                languages: {
                    typescript: () => import('highlight.js/lib/languages/typescript'),
                    css: () => import('highlight.js/lib/languages/css'),
                    xml: () => import('highlight.js/lib/languages/xml'),
                },
            },
        },
    ]
};

