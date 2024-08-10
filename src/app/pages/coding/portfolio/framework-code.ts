export const angularCode = `import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'angular-example',
    standalone: true,
    template: \`
        <label> Name:</label>
        <input type="text" [(ngModel)]="name"
               placeholder="Enter a name here"/>
        <hr/>
        <h1>Hello {{name}}!</h1>
     \`,
    imports: [FormsModule],
})
export class ExampleComponent {
    name = '';
}`;


export const reactCode = `import { useState } from 'react';

export default function Example() {
    const [name, setName] = useState('');

    return (
        <div>
            <label>Name:</label>
            <input
                type="text"
                value={name}
                onChange={(e) = setName(e.target.value)}
                placeholder="Enter a name here"
            />
            <hr />
            <h1>Hello {name}!</h1>
        </div>
    );
};`;

