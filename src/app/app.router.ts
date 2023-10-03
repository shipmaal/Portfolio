import { Routes } from '@angular/router';

import { HomePageComponent } from './home-page/home-page.component';


export const APP_ROUTES: Routes = [
	{
		path: '',
        component: HomePageComponent
	},
	{
		path: 'about',
		loadComponent: () =>
			import('./pages/about/about.component')
				.then(m => m.AboutComponent)
	},
	{
		path: 'education',
		loadComponent: () =>
			import('./pages/education/education.component')
				.then(m => m.EducationComponent)

	},
	{
		path: 'coding',
		loadComponent: () =>
			import('./pages/coding/coding.component')
				.then(m => m.CodingComponent)
	},
	{
		path: 'music',
		loadComponent: () =>
			import('./pages/music/music.component')
				.then(m => m.MusicComponent)
	},
	{
		path: 'contact',
		loadComponent: () =>
			import('./pages/contact/contact.component')
				.then(m => m.ContactComponent)
}

]
	

