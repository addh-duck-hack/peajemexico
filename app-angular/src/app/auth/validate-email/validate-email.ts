import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '@environments/environment';
import { map } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';

@Component({
  selector: 'app-validate-email',
  imports: [RouterLink, Navbar, MainFooter],
  templateUrl: './validate-email.html',
  styleUrl: './validate-email.css'
})
export default class ValidateEmail {
  env = environment
  token = toSignal(
    inject(ActivatedRoute).queryParams.pipe(
      map((params) => params['token'])
    )
  );

  // Variable para manejar errores
  descriptionErrors = signal<string[]>([])
  descriptionSuccess = signal<string>('')
  // Bandera para bloquear el botón mientras se consume el servicio
  loading = signal(false);

  // Consumo de servicios
  userService = inject(UserService);
  router = inject(Router);

  constructor(){
    if(!this.token()){
      this.router.navigate(['/']);
    }
  }

  validateEmail(){
    if (this.loading()) return;
    console.log('Se va a validar el token: ' + this.token());
    this.loading.set(true);
    this.userService.validateEmail(this.token()).subscribe({
      next: (response) => {
        // Guardar la sesión del usuario
        this.descriptionSuccess.set(response.message);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.descriptionErrors.set([error.error.error.message]);
        this.loading.set(false);
      }
    })
  }
}
