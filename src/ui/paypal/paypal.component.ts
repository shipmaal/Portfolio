import { Component } from '@angular/core';
import { ppSVG, paypalSVG } from './paypal.svgdata'

@Component({
    selector: 'paypal-button',
    standalone: true,
    templateUrl: './paypal.component.html',
    styleUrls: ['./paypal.component.scss']
})
export class PaypalComponent {
    ppSVG = ppSVG;
    paypalSVG = paypalSVG;

}
