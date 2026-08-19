import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '@environments/environment';

@Component({
  selector: 'main-footer',
  imports: [RouterLink],
  templateUrl: './main-footer.html',
  styleUrl: './main-footer.css'
})
export class MainFooter {
  env = environment
  logo = 'logo/logo-color.png';
}
