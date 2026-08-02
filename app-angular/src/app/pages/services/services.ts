import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from 'src/app/shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';
import { SeoService } from 'src/app/services/seo.service';

interface PlanFeature {
  text: string;
}

interface Plan {
  name: string;
  price: string;
  priceNote: string;
  limit: string;
  limitNote: string;
  features: PlanFeature[];
  ctaLabel: string;
  ctaLink?: string;
  ctaClass: string;
  highlighted?: boolean;
}

const PRIMARY_CTA_CLASS =
  'bg-[var(--color-accent)] text-[var(--color-ink-invert)] hover:bg-[var(--color-accent-hover)]';
const SECONDARY_CTA_CLASS =
  'border border-[var(--color-border)] text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)]';

@Component({
  selector: 'app-services',
  imports: [Navbar, MainFooter, RouterLink],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export default class Services {
  private seo = inject(SeoService);

  constructor() {
    this.seo.update({
      path: 'servicios',
      title: 'Planes y servicios | PeajesMX',
      description: 'Conoce los planes de PeajesMX: calculadora gratuita sin registro, cuenta registrada con más consultas, y acceso empresarial vía API.'
    });
  }

  plans: Plan[] = [
    {
      name: 'Usuario no registrado',
      price: 'Gratis',
      priceNote: 'Sin necesidad de crear una cuenta',
      limit: '30 consultas',
      limitNote: 'cada 10 minutos por dirección IP',
      features: [
        { text: 'Cálculo de costo de casetas para rutas con uno o varios destinos' },
        { text: 'Selección de origen y destinos desde el mapa o por búsqueda' },
        { text: 'Desglose del costo por caseta, con distancia y tiempo estimado' },
        { text: 'Ajuste según el tipo de vehículo' },
      ],
      ctaLabel: 'Usar la calculadora',
      ctaLink: '/calcular-mi-ruta',
      ctaClass: SECONDARY_CTA_CLASS,
    },
    {
      name: 'Usuario registrado',
      price: 'Gratis',
      priceNote: 'Creando una cuenta en el sitio',
      limit: '500 consultas',
      limitNote: 'cada 10 minutos por dirección IP',
      features: [
        { text: 'Todo lo incluido en el plan sin registro' },
        { text: 'Límite de consultas ampliado para uso más frecuente' },
        { text: 'Pensado para agencias de viajes, choferes y uso recurrente' },
      ],
      ctaLabel: 'Crear cuenta',
      ctaLink: '/login',
      ctaClass: PRIMARY_CTA_CLASS,
      highlighted: true,
    },
    {
      name: 'Cuenta empresarial',
      price: 'Personalizado',
      priceNote: 'El costo se define directamente con el desarrollador',
      limit: 'Sin límite',
      limitNote: 'de consultas vía API',
      features: [
        { text: 'Acceso a la API para realizar consultas sin límites' },
        { text: 'Apoyo para integrar el servicio en tu aplicación o sitio web' },
        { text: 'Soporte por WhatsApp o teléfono, de lunes a viernes de 10:00 a 4:30 pm (hora CDMX)' },
      ],
      ctaLabel: 'Contactar para cotizar',
      ctaLink: '/contacto',
      ctaClass: SECONDARY_CTA_CLASS,
    },
  ];
}
