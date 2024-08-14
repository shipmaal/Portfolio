import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { APP_ROUTES } from "./app.router";
import { provideHighlightOptions } from "ngx-highlightjs";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(APP_ROUTES),
        provideHighlightOptions({
            coreLibraryLoader: () => import('highlight.js/lib/core'),
            lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'), // Optional, add line numbers if needed
            languages: {
              typescript: () => import('highlight.js/lib/languages/typescript'),
              css: () => import('highlight.js/lib/languages/css'),
              xml: () => import('highlight.js/lib/languages/xml')
            }
          })
    ]
};

