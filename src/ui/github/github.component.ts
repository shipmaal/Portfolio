import { Component } from '@angular/core';
import { svgData } from './github.svgdata'

@Component({
    selector: 'logo-github',
    standalone: true,
    templateUrl: './github.component.html',
    styleUrls: ['./github.component.scss']
})
export class GithubComponent {
    svgData = svgData;

}
