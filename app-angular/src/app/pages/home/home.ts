import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar';
import { MainFooter } from 'src/app/shared/components/main-footer/main-footer';

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
  imports: [Navbar, MainFooter, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export default class Home {
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
      title: 'Busca tu origen y destino',
      description: 'Escribe los puntos de tu viaje y selecciónalos de la lista de resultados.'
    },
    {
      number: '02',
      title: 'Elige tu vehículo',
      description: 'Selecciona el tipo de vehículo y, si aplica, los ejes excedentes.'
    },
    {
      number: '03',
      title: 'Obtén el costo',
      description: 'Revisa el total estimado y el detalle de cada caseta en tu ruta.'
    }
  ];
}
