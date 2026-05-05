import { Component, input } from '@angular/core';
import { SectionItem } from '../../interfaces/section-separator.interface';


@Component({
  selector: 'section-separator',
  imports: [],
  templateUrl: './section-separator.html',
  styleUrl: './section-separator.css'
})

export class SectionSeparator {
  section = input.required<SectionItem>();
}
