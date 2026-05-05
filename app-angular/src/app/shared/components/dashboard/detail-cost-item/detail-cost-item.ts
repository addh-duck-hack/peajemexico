import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DetailCostData } from 'src/app/shared/interfaces/detail-cost-data.interface';

@Component({
  selector: 'detail-cost-item',
  imports: [],
  templateUrl: './detail-cost-item.html',
  styleUrl: './detail-cost-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailCostItem {
  dataCost = input.required<DetailCostData>();
  openDetail = output<boolean>();
}
