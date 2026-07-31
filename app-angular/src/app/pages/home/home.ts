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
