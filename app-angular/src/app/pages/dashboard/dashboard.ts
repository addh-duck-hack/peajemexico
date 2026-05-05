import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { NavbarDashboard } from 'src/app/shared/components/dashboard/navbar-dashboard/navbar-dashboard';
import { SideMenuDashboard } from 'src/app/shared/components/dashboard/side-menu-dashboard/side-menu-dashboard';
import { FooterDashboard } from '../../shared/components/dashboard/footer-dashboard/footer-dashboard';

@Component({
  selector: 'dashboard',
  imports: [NavbarDashboard, SideMenuDashboard, RouterOutlet, FooterDashboard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export default class Dashboard {
  userService = inject(UserService);
  router = inject(Router)

  constructor(){
    if(!this.userService.isTokenValid()){
      this.router.navigate(['/']);
    }
  }
}
