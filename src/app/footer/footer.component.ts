import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaypalComponent, LinkedinComponent, GithubComponent } from '@ui'


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, PaypalComponent, LinkedinComponent, GithubComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  pages = [
    { label: "About Me", link: "/about" },
    { label: "Education", link: "/education" },
    { label: "Coding Experience", link: "/coding" },
    { label: "Music  Experience", link: "/music" },
    { label: "Contact Me", link: "/contact" }
  ];
}
