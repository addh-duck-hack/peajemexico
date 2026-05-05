import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '@environments/environment';
import { map } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-validate-email',
  imports: [RouterLink],
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

  // Consumo de servicios
  userService = inject(UserService);

  validateEmail(){
    console.log('Se va a validar el token: ' + this.token());
    this.userService.validateEmail(this.token()).subscribe({
      next: (response) => {
        // Guardar la sesión del usuario
        this.descriptionSuccess.set(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.descriptionErrors.set([error.error.error.message]);
      }
    })
  }
}
