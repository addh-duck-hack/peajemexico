import { Component } from '@angular/core';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';

@Component({
  selector: 'privacy-policy',
  imports: [Navbar, MainFooter],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.css',
})
export default class PrivacyPolicy { }
