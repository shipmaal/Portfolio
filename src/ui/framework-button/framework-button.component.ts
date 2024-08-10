import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-framework-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './framework-button.component.html',
  styleUrl: './framework-button.component.scss'
})
export class FrameworkButtonComponent {
    @Output() buttonState = new EventEmitter<string>();
    codeState: string = 'Angular'

    addNewItem() {
        this.buttonState.emit(this.codeState === 'Angular' ? 'React' : 'Angular');
        this.codeState = this.codeState === 'Angular' ? 'React' : 'Angular';
    }

}
