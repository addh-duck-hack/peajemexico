import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';
import { SkeletonContentLoader } from 'src/app/shared/components/skeleton/skeleton-content-loader/skeleton-content-loader';
import { MailService } from 'src/app/services/mail.service';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-contact-us',
  imports: [Navbar, MainFooter, SkeletonContentLoader],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css',
})
export default class ContactUs {
  private mailService = inject(MailService);
  private seo = inject(SeoService);

  constructor() {
    this.seo.update({
      path: 'contacto',
      title: 'Contacto | PeajesMX',
      description: 'Ponte en contacto con PeajesMX para dudas, soporte o cotizaciones de acceso vía API a la calculadora de casetas.'
    });
  }

  fullName = signal('');
  email = signal('');
  phone = signal('');
  service = signal('');
  message = signal('');

  sendLoading = signal(false);
  sendSuccess = signal(false);
  formErrors = signal<string[]>([]);

  submitContactForm() {
    this.formErrors.set([]);
    this.sendSuccess.set(false);
    const newErrors: string[] = [];

    const fullName = this.fullName().trim();
    const email = this.email().trim();
    const service = this.service().trim();
    const message = this.message().trim();

    if (fullName.length < 2 || fullName.length > 100) {
      newErrors.push('El nombre completo debe tener entre 2 y 100 caracteres.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.push('El correo electrónico no es válido.');
    }
    if (!service) {
      newErrors.push('Indica el servicio o motivo de contacto.');
    }
    if (message.length < 10 || message.length > 2000) {
      newErrors.push('El mensaje debe tener entre 10 y 2000 caracteres.');
    }

    if (newErrors.length > 0) {
      this.formErrors.set(newErrors);
      return;
    }

    if (this.sendLoading()) return;
    this.sendLoading.set(true);

    this.mailService.sendContactEmail({
      fullName,
      email,
      phone: this.phone().trim(),
      service,
      message
    }).subscribe({
      next: () => {
        this.sendLoading.set(false);
        this.sendSuccess.set(true);
        this.fullName.set('');
        this.email.set('');
        this.phone.set('');
        this.service.set('');
        this.message.set('');
      },
      error: (error: HttpErrorResponse) => {
        this.sendLoading.set(false);
        this.formErrors.set([error.error?.error?.message ?? 'No se pudo enviar tu mensaje, intenta más tarde.']);
      }
    });
  }
}
