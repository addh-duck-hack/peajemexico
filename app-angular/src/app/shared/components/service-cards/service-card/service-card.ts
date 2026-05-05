import { Component, input } from '@angular/core';
import { SectionItem } from 'src/app/shared/interfaces/section-separator.interface';

@Component({
  selector: 'service-card',
  imports: [],
  templateUrl: './service-card.html',
  styleUrl: './service-card.css'
})
export class ServiceCard {
  card = input.required<SectionItem>();
}
