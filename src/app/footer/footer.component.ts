import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaypalComponent } from '@ui/paypal/paypal.component'
import { LinkedinComponent } from '@ui/linkedin/linkedin.component'
import { GithubComponent } from '@ui/github/github.component';

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

    socials = [
        { label: "LinkedIn", link: "https://www.facebook.com/alexander.lee.520900" },
    ]

}
