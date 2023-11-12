import { Component, OnInit } from '@angular/core';
import { ExampleComponent } from './example/example.component'
import { FrameworkButtonComponent } from '@ui/framework-button/framework-button.component'
import {
    HighlightLoader,
    HighlightModule,
} from 'ngx-highlightjs';

const themeGithub: string = 'node_modules/highlight.js/styles/github.css';


@Component({
    selector: 'app-portfolio',
    standalone: true,
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss'],
    imports: [ExampleComponent, HighlightModule, FrameworkButtonComponent]
})
export class PortfolioComponent implements OnInit{

    code = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'angular-example',
    standalone: true,
    template: \`
        <label> Name:</label>
        <input type="text" [(ngModel)]="name" placeholder="Enter a name here"/>
        <hr/>
        <h1>Hello {{name}}!</h1>
     \`,
    imports: [FormsModule],
})
export class ExampleComponent {
    name = '';
}`;
    currentTheme: string = themeGithub;

    ngOnInit() {
    }

    constructor(private hljsLoader: HighlightLoader) { }

    

}
