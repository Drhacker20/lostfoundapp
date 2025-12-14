import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lost-item-popover',
  templateUrl: './lost-item-popover.component.html',
  styleUrls: ['./lost-item-popover.component.scss'],
  standalone: false
})
export class LostItemPopoverComponent {
  @Input() item: any; // data passed from the page
}
