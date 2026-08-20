import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from 'src/app/services/seo.service';
import { Navbar } from 'src/app/shared/components/navbar/navbar';

@Component({
  selector: 'admin-home',
  imports: [RouterLink, Navbar],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css',
})
export default class AdminHome {
  private seo = inject(SeoService);

  constructor() {
    this.seo.setNoIndex();
  }
}
