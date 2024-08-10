import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-angular-code',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './angular-code.component.html',
  styleUrl: './framework-code.component.scss'
})
export class AngularCodeComponent {

}

@Component({
    selector: 'app-react-code',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './react-code.component.html',
    styleUrl: './framework-code.component.scss'
})
export class ReactCodeComponent {

}
