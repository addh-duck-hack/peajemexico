import { Component, input } from '@angular/core';
import { ServiceCard } from './service-card/service-card';
import { SectionItem } from '../../interfaces/section-separator.interface';

@Component({
  selector: 'service-cards',
  imports: [ServiceCard],
  templateUrl: './service-cards.html',
  styleUrl: './service-cards.css'
})
export class ServiceCards {
  cards = input.required<SectionItem[]>();
}
