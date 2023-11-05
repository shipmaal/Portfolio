import { Component, Input } from '@angular/core';
import { svgData } from './linkedin.svgdata'

@Component({
    selector: 'logo-linkedin',
    standalone: true,
    templateUrl: './linkedin.component.html',
    styleUrls: ['./linkedin.component.scss']
})
export class LinkedinComponent {

    svgData = svgData;

    @Input() length: string = '200';
     
    viewbox: string = '0 0 ' + this.length + ' ' + this.length;
    scaleNum = Number(this.length) / 24;
    scale = 'translate(0, 32) scale('+this.scaleNum+')';
    datasupporteddps = this.length + 'x' + this.length;

}
