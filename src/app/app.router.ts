import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AboutComponent } from './pages/about/about.component';
import { EducationComponent } from './pages/education/education.component';
import { CodingComponent } from './pages/coding/coding.component';
import { MusicComponent } from './pages/music/music.component';
import { ContactComponent } from './pages/contact/contact.component';


export const APP_ROUTES: Routes = [
    {
        path: '',
        component: HomePageComponent
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'education',
        component: EducationComponent
    },
    {
        path: 'coding',
        component: CodingComponent
    },
    {
      path: 'music',
      component: MusicComponent
    },
    {
      path: 'contact',
      component: ContactComponent
    }
];
