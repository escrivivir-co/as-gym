import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HeaderModule } from './components/header/header.module';
import { FooterModule } from './components/footer/footer.module';
import { ServerService } from './services/socketio/server.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
	CommonModule,
	RouterLink,
	RouterOutlet,
	HeaderModule,
	FooterModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-routing';
  footerUrl = 'https://www.escrivivir.co';
  footerLink = 'www.escrivivir.co';
  serverService = inject(ServerService);

  constructor(
	@Inject(DOCUMENT) private document: Document,
	@Inject(PLATFORM_ID) private platformId: object) {
  }

  ngOnInit(): void {

	if (isPlatformBrowser(this.platformId)) {

	  	this.document.body.setAttribute('data-bs-theme', 'light');
	  	const navMain = this.document.getElementById('navbarCollapse');
	  	if (navMain) {
			navMain.onclick = function onClick() {
		  	if (navMain) {
				navMain.classList.remove("show");
		  	}
		}
	  }
	}
  }

}

