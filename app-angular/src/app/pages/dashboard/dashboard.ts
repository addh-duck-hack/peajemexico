import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';

@Component({
  selector: 'dashboard',
  imports: [Navbar, RouterOutlet, MainFooter],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export default class Dashboard { }
