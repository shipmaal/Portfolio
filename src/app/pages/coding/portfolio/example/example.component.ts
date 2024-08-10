import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'angular-example',
    standalone: true,
    template: `
    <label>Name:</label>
    <input type="text" [(ngModel)]="name" placeholder="Enter a name here"/>
    <hr />
    <div >
        <h1 >Hello {{ name }}!</h1>
    </div>
  `,
  styleUrls: ['./example.component.scss'],
    imports: [FormsModule],
})
export class ExampleComponent {
    name = '';
}
