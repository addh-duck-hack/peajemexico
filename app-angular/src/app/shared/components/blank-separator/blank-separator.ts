import { Component, input } from '@angular/core';

@Component({
  selector: 'blank-separator',
  imports: [],
  template: `<div [style.height]="height() + 'vh'"></div>`
})
export class BlankSeparator {
  height = input.required<number>();
}
