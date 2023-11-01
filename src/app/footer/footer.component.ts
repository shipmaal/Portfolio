import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaypalComponent } from '@templates/paypal/paypal.component'

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, PaypalComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

}
