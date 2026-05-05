import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'navbar-dashboard',
  imports: [],
  templateUrl: './navbar-dashboard.html',
  styleUrl: './navbar-dashboard.css'
})

export class NavbarDashboard {
  env = environment
  imageSrc = 'images/logo_opcaity.png';

  userService = inject(UserService);
  router = inject(Router)

  closeSesion(){
    this.userService.clearSession();
    this.router.navigate(['/']);
  }
}
