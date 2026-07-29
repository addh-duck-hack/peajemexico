import { Component } from '@angular/core';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';

@Component({
  selector: 'legal',
  imports: [Navbar, MainFooter],
  templateUrl: './legal.html',
  styleUrl: './legal.css',
})
export default class Legal { }
