import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';
import { SeoService } from 'src/app/services/seo.service';

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface StepItem {
  number: string;
  title: string;
  description: string;
}

@Component({
  selector: 'home',
  imports: [Navbar, MainFooter, RouterLink, NgOptimizedImage],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export default class Home {
  private seo = inject(SeoService);

  constructor() {
    this.seo.update({
      path: '',
      title: 'PeajesMX — Calculadora de costos de casetas en México',
      description: 'Calcula gratis el costo de las casetas de tu ruta en México con uno o varios destinos, ajustado a tu tipo de vehículo. Sin necesidad de crear una cuenta.'
    });
    // Datos de identificación (RFC, domicilio, contacto) tomados de /legales, la
    // fuente formal de estos datos (ver legal.html, sección "Identificación de la Empresa").
    this.seo.setJsonLd('organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'PeajesMX',
      legalName: 'Duck Hack',
      alternateName: 'PeajesMX.com',
      url: 'https://peajesmx.com/',
      logo: 'https://peajesmx.com/images/logo-mark.svg',
      image: 'https://peajesmx.com/images/hero-highway.jpg',
      description: 'Calculadora gratuita del costo de casetas para rutas con uno o varios destinos en México, basada en datos del INEGI.',
      taxID: 'CAJA911127IH1',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Priv. Flor de Azucena No 112, Col. Paseos de Chavarría',
        addressLocality: 'Mineral de la Reforma',
        addressRegion: 'Hidalgo',
        postalCode: '42186',
        addressCountry: 'MX'
      },
      contactPoint: [{
        '@type': 'ContactPoint',
        telephone: '+52-566-165-3418',
        email: 'redes.sociales@duck-hack.com',
        contactType: 'customer service',
        areaServed: 'MX',
        availableLanguage: ['es']
      }],
      sameAs: ['https://mx.duck-hack.cloud']
    });
    this.seo.setJsonLd('website', {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'PeajesMX',
      url: 'https://peajesmx.com/',
      inLanguage: 'es-MX',
      publisher: { '@type': 'Organization', name: 'PeajesMX' }
    });
  }

  features: FeatureItem[] = [
    {
      icon: 'fa-solid fa-route',
      title: 'Rutas con varios destinos',
      description: 'Busca tu punto de origen y agrega los destinos que necesites para armar el trayecto completo de tu viaje.'
    },
    {
      icon: 'fa-solid fa-truck-moving',
      title: 'Según tu vehículo',
      description: 'Ajusta el cálculo por tipo de vehículo, incluyendo camiones con ejes excedentes.'
    },
    {
      icon: 'fa-solid fa-map-location-dot',
      title: 'Desglose por caseta',
      description: 'Consulta el costo de cada caseta sobre el mapa, con distancia y tiempo estimado por tramo.'
    }
  ];

  steps: StepItem[] = [
    {
      number: '01',
      title: 'Busca o marca tu origen',
      description: 'Escribe tu punto de partida en el buscador o selecciónalo directamente sobre el mapa.'
    },
    {
      number: '02',
      title: 'Agrega tus destinos',
      description: 'Suma uno o varios destinos para armar el trayecto completo de tu viaje.'
    },
    {
      number: '03',
      title: 'Elige tu vehículo',
      description: 'Selecciona el tipo de vehículo y, si aplica, los ejes excedentes.'
    },
    {
      number: '04',
      title: 'Obtén el costo total',
      description: 'Revisa el total estimado de casetas para toda la ruta.'
    },
    {
      number: '05',
      title: 'Consulta el detalle por caseta',
      description: 'Ve la distancia, el tiempo y el costo de cada tramo, marcado directamente en el mapa.'
    },
    {
      number: '06',
      title: 'Todo sin costo',
      description: 'Es gratis y no necesitas crear una cuenta para usar la calculadora.'
    }
  ];
}
