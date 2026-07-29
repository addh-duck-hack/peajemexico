import { Component } from '@angular/core';
import { environment } from '@environments/environment';

@Component({
  selector: 'main-footer',
  imports: [],
  templateUrl: './main-footer.html',
  styleUrl: './main-footer.css'
})
export class MainFooter {
  env = environment
  logo = 'images/logo-mark.svg';
}
