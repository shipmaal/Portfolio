import { Component } from '@angular/core';
import { ExampleComponent } from './example/example.component'
import { FrameworkButtonComponent } from '@ui/framework-button/framework-button.component'

import { AngularCodeComponent, ReactCodeComponent } from '@templates/framework-code/framework-code.component';

import { HighlightModule } from 'ngx-highlightjs';

import { angularCode, reactCode } from './framework-code';


@Component({
    selector: 'app-portfolio',
    standalone: true,
    templateUrl: './portfolio.component.html',
    styleUrls: ['./portfolio.component.scss'],
    imports: [ExampleComponent, HighlightModule,
        FrameworkButtonComponent, AngularCodeComponent,
        ReactCodeComponent,
    ]
})
export class PortfolioComponent {

    code = angularCode;
    framework = 'Angular';

    updateFramework(framework: string) {
        this.framework = framework;
        this.code = (framework === 'Angular') ? angularCode : reactCode;
        console.log(this.code);
    }

}
