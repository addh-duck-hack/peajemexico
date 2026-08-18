import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '@environments/environment';
import { map } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-reset-password',
  imports: [RouterLink, Navbar, MainFooter],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export default class ResetPassword {
  env = environment
  token = toSignal(
    inject(ActivatedRoute).queryParams.pipe(
      map((params) => params['token'])
    )
  );

  // Variables para formulario
  password = signal('');
  password2 = signal('');
  // Variable para manejar errores
  descriptionErrors = signal<string[]>([])
  descriptionSuccess = signal<string>('')
  // Bandera para bloquear el formulario mientras se consume el servicio
  loading = signal(false);

  // Consumo de servicios
  userService = inject(UserService);
  router = inject(Router);
  private seo = inject(SeoService);

  constructor(){
    // Ruta solo-CSR, sin HTML prerenderizado propio y ya bloqueada en robots.txt.
    this.seo.setNoIndex();
    if(!this.token()){
      this.router.navigate(['/']);
    }
  }

  submitForm(){
    if (this.loading()) return;
    // Limpiar errores previos
    this.descriptionErrors.set([]);
    this.descriptionSuccess.set("");
    const errors: string[] = [];

    // Validar que todos los campos estén llenos
    if (!this.password()) {
      errors.push('La contraseña es requerida');
    }

    // Validar que la password tenga al menos 6 caracteres
    if (this.password() && this.password().length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    //Validar que las contraseñas coincidan
    if(this.password() != this.password2()){
      errors.push('Las contraseñas no coinciden');
    }

    // Si hay errores, almacenarlos y retornar
    if (errors.length > 0) {
      this.descriptionErrors.set(errors);
      return;
    }

    // Si todas las validaciones pasaron, continuar con el registro
    console.log('Formulario válido, proceder con el registro');

    // Cunsumir el servicio para registrar usuario
    this.loading.set(true);
    this.userService.resetPassword(this.token(),this.password()).subscribe({
      next: (response) => {
        // Cuando el registro se hace de manera exitosa se limpia el formulario y se muestra mensaje del servicio
        if (response.message){
          this.descriptionSuccess.set(response.message);
        }else{
          this.descriptionSuccess.set("Contraseña cambiada correctamente");
        }
        this.password.set("");
        this.password2.set("");
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        // Mostrar el mensaje de error del servidor
        this.descriptionErrors.set([error.error.error.message]);
        this.loading.set(false);
      }
    });
  }
}
