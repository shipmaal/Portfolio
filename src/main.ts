import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

import { initializeApp } from "firebase/app";


bootstrapApplication(AppComponent, appConfig)
    .catch(err => console.error(err));

const firebaseConfig = {
    apiKey: import.meta.env['API_KEY'],
    authDomain: import.meta.env['AUTH_DOMAIN'],
    projectId: import.meta.env['PROJECT_ID'],
    storageBucket: import.meta.env['STORAGE_BUCKET'],
    messagingSenderId: import.meta.env['MESSAGING_SENDER_ID'],
    appId: import.meta.env['APP_ID'],
    measurementId: import.meta.env['MEASUREMENT_ID'],
};


// Initialize Firebase
//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
//const performance = getPerformance(app);
//export const storage = getStorage(app);

