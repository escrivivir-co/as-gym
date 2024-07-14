import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { PLATFORM_ID } from '@angular/core';

import { Quote } from './quote';

import { SeoService } from '../../../services/seo/seo.service';
import { Feature } from './feature';
import { Dependency } from './dependency';
import { ServerService } from '../../../services/socketio/server.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {

  dependencies: Dependency;
  features: Feature;
  quote: Quote;
  id: number;

  serverService: any /* ServerService */;

  constructor(
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: object) {

    const content = 'About content with meta';
    this.seoService.setMetaDescription(content);

    this.id = 0;
    this.quote = new Quote();
    this.dependencies = {
      frontend: [
        { name: 'Angular 17.2.4' },
        { name: 'Angular CLI 17.2.3' },
        { name: 'Angular SSR 17.2.3' },
        { name: 'Bootstrap 5.3.3' },
        { name: 'Font Awesome 6.5.1' },
      ],
      backend: [
        { name: 'Node.js 18.17.1' },
        { name: 'Express 4.18.2' },
        { name: 'pg-promise 11.5.4' },
      ]
    };

    this.features = {
      frontend: [
        {
          name: 'Angular CLI',
          englishTutorial: 'https://www.escrivivir.co/tutorials/getting-started-with-angular',
          frenchTutorial: 'https://www.escrivivir.co/tutorials/demarrer-avec-angular',
        },
        {
          name: 'Routing',
          englishTutorial: 'https://www.escrivivir.co/tutorials/routing-with-angular',
          frenchTutorial: 'https://www.escrivivir.co/tutorials/routing-avec-angular',
        },
        {
          name: 'Lazy loading',
          englishTutorial: 'https://www.escrivivir.co/tutorials/lazy-loading-with-angular',
          frenchTutorial: 'https://www.escrivivir.co/tutorials/lazy-loading-avec-angular',
        },
        {
          name: 'Bootstrap',
          englishTutorial: 'https://www.escrivivir.co/tutorials/bootstrap-with-angular',
          frenchTutorial: 'https://www.escrivivir.co/tutorials/bootstrap-avec-angular',
        },
        {
          name: 'Server side Rendering',
          englishTutorial: 'https://www.escrivivir.co/tutorials/server-side-rendering-with-angular-universal',
          frenchTutorial: 'https://www.escrivivir.co/tutorials/server-side-rendering-avec-angular-universal',
        },
        {
          name: 'HTTPClient',
          englishTutorial: 'https://www.escrivivir.co/tutorials/httpclient-with-angular',
          frenchTutorial: 'https://www.escrivivir.co/tutorials/httpclient-avec-angular',
        },
        {
          name: 'Transfer State',
          englishTutorial: 'https://www.escrivivir.co/tutorials/transfer-state-with-angular',
          frenchTutorial: 'https://www.escrivivir.co/tutorials/transfer-state-avec-angular',
        },
        {
          name: 'Progressive Web App',
          englishTutorial: 'https://www.escrivivir.co/tutorials/progressive-web-app-with-angular',
          frenchTutorial: 'https://www.escrivivir.co/tutorials/progressive-web-app-avec-angular',
        },
        {
          name: 'Search Engine optimization',
          englishTutorial: 'https://www.escrivivir.co/tutorials/search-engine-optimization-with-angular',
          frenchTutorial: 'https://www.escrivivir.co/tutorials/search-engine-optimization-avec-angular',
        },
        {
          name: 'Components',
          englishTutorial: '',
          frenchTutorial: 'https://www.escrivivir.co/tutorials/components-avec-angular',
        },
        {
          name: 'Services',
          englishTutorial: '',
          frenchTutorial: 'https://www.escrivivir.co/tutorials/services-avec-angular',
        },
      ],
      backend: [
        { name: 'Local JSON' },
        { name: 'RESTFull API' },
        { name: 'CRUD API' },
        { name: 'Database Creation' },
        { name: 'Data Import' },
        { name: 'Data Export' },
      ]
    };

	console.log("Is ", "ABOUT")
	if (isPlatformBrowser(this.platformId)) {
		console.log("Is BROWSER", "ABOUT")
		setTimeout(() => {
			this.serverService = inject(ServerService);
		}, 3000);
	}


  }

  ngOnInit(): void {
    this.loadQuote();

    const content =
      'Cette application a été développée avec Angular version 16.1.7 et bootstrap 5.3.2' +
      ' Elle applique le Routing, le Lazy loading, le Server side rendering et les Progressive Web App (PWA)';

    const title = 'angular-starter Title : About Page';

    this.seoService.setMetaDescription(content);
    this.seoService.setMetaTitle(title);

  }


  loadQuote() {
    const quotes = [
      {
        name: 'Lawrence of Arabia',
        title: 'There is nothing in the desert and no man needs nothing',
        link: 'https://en.wikipedia.org/wiki/Lawrence_of_Arabia_(film)'
      },
      {
        name: 'Alien Prometheus',
        title: 'Big things have small beginnings',
        link: 'https://en.wikipedia.org/wiki/Prometheus_(2012_film)'
      },
      {
        name: 'Blade Runner',
        title: 'All those moments will be lost in time... like tears in rain... Time to die.',
        link: 'https://en.wikipedia.org/wiki/Blade_Runner'
      },
    ];
    const index = quotes.length;
    let id = this.id;
    while (this.id === id) {
      id = Math.floor(Math.random() * index);
    }
    this.id = id;
    this.quote = quotes[id];
  }



}
